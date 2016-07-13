import { extendObservable, observable, autorun, isObservable, isObservableMap, computed, toJS } from "mobx";
import { filter, pick, sortBy, take, first, map, reverse, find } from 'lodash/fp';
import moment from 'moment-timezone';
import waterfall from 'async/waterfall';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';
import change from 'percent-change';
import Promise from 'bluebird';

export default class Classes {
  db;
  ws;
  @observable peopleFilter;
  @observable isUpdating = false;
  
  constructor(db, websocket) {
    let self = this;
    if (db) {
      this.setupDb(db);
    }
    if (websocket) {
      this.setupWs(websocket);
    }
    
  }
  
  setupDb(db) {
    this.db = db;
  }

  setupWs(websocket) {
    let self = this;
    this.ws = websocket;
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  isClassDay(day) {
     day = this.isNumeric(day) ? day : moment().weekday();
     let classDay = this.getMeetingDay(day);
        
     return (classDay.length) ? true : false;
  }

  getDivisionConfigs() {
    let self = this;
    return new Promise(function(resolve, reject){
      let records = self.db.store(
            'divisionConfigs', 
            [
              filter((x) => x.deletedAt === null)
            ]
          );
      resolve(records);
    });
  }

  getDivisionConfig(id) {
    let self = this;
    return new Promise(function(resolve, reject){
      let record = self.db.store(
            'divisionConfigs', 
            [
              filter((x) => x.deletedAt === null && x.id === id),
              first
            ]
          );
      resolve(record);
    });
  }
  
  async getClasses() {
    let records = await this.db.store(
            'classes', 
            [
              sortBy('order')
            ]
          );
    //console.log("years", years);
    return records;
  }

  async getDivisionYears(divisionConfigId) {
    let records = await this.db.store(
            'divisionYears', 
            [
              filter((x) => x.deletedAt === null && x.divisionConfigId=== divisionConfigId),
              sortBy('endDate')
            ]
          );
    //console.log("years", years);
    return records;
  }

  getDivision(id) {
    let self = this;
    return new Promise(function(resolve, reject){
      let record = self.db.store(
              'divisions', 
              [
                filter((x) => x.deletedAt === null && x.id === id),
                first
              ]
            );
      resolve(record);
    });
  }

  getCurrentDivisionYear(divisionConfigId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let now = moment().valueOf(),
          record = self.db.store(
            'divisionYears', 
            [
              filter((x) => x.deletedAt === null && x.endDate >= now && x.startDate <= now && x.divisionConfigId === divisionConfigId),
              first
            ]
          );
      //console.log("year", year);
      resolve(record);
    });
  }

  async getDivisionScheduleOrdered(configId, yearId) {
    configId = configId || this.db.store(
        'divisionConfigs', 
        [
          first
        ]
      );
    let now = moment().valueOf(),
        schedule, future = [], past = [];
    if (!yearId) {
      yearId = await this.db.store(
        'divisionYears', 
        [
          filter((x) => x.deletedAt === null && x.endDate >= now && x.startDate <= now && x.divisionConfigId === configId),
          first
        ]
      ).id;
    }
    schedule = await this.db.store(
      'divisions', 
      [
        filter((x) => x.deletedAt === null && x.divisionYear >= yearId && x.divisionConfigId === configId),
      ]
    );
    schedule.forEach(function(div){
      if (moment(div.end).isSameOrAfter()) {
        future.push(div);
      } else {
        past.push(div);
      }
    });
    future = await sortBy(future)('end');
    past = await sortBy(past)('end');
    schedule = await future.concat(past)
    //console.log("schedule", schedule);
    return schedule;
  }

  async getDivisionSchedules(configId, yearId) {
    let records = await this.db.store(
            'divisions', 
            [
              filter((x) => x.deletedAt === null && x.divisionYear === yearId && x.divisionConfigId === configId),
              sortBy('end')
            ]
          );
    return records;
  }

  async getCurrentDivisionSchedule(configId, yearId) {
    let now = moment().valueOf();
    let records = await this.db.store(
          'divisions', 
          [
            filter((x) => x.deletedAt === null && x.end >= now && x.start <= now && x.divisionYear === yearId && x.divisionConfigId === configId),
            sortBy('end'),
            first
          ]
        );
    return records;
  }

  async getDivisionSchedule(id) {
    let now = moment().valueOf(),
        schedule;
    let record = await this.db.store(
          'divisions', 
          [
            filter((x) => x.deletedAt === null && x.id === id),
            sortBy('end'),
            first
          ]
        );
    return record;
  }

  latestAttendance(day, length) {
    //console.log(day, length);
    let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(length, "week").valueOf(),
        latest = this.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.attendanceDate >= now && x.day === day),
            sortBy('attendanceDate')
          ]
        ).reduce(
          function(map, d){
            map[d.attendanceDate] = (map[d.attendanceDate] || 0) + d.count;
            return map;
          },
          Object.create(null)
        ),
        result = Object.keys(latest).map(function(k) { return {attendance: latest[k], attendanceDate: parseInt(k, 10)}; });
    return result;
  }

  avgAttendance(day, begin, end) {
    day = day || 0;
    begin = begin || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(4, "week").valueOf();
    end = end || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss')).valueOf();

    let latest = this.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.attendanceDate >= begin && x.attendanceDate <= end && x.day === day),
            sortBy('attendanceDate')
          ]
        ).reduce(
          function(map, d){
            map[d.attendanceDate] = (map[d.attendanceDate] || 0) + d.count;
            return map;
          },
          Object.create(null)
        ),
        avg = 0;
    Object.keys(latest).forEach(function(day, index) { avg += latest[day]; });
    avg = avg / Object.keys(latest).length;
    return avg.toFixed(0);
  }

  attendancePercentChange(day) {
    day = day || 0;
    let priorBegin = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(8, "week").valueOf(),
        priorEnd = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss')).subtract(4, "week").valueOf(),
        priorAvg =  this.avgAttendance(day, priorBegin, priorEnd),
        currAvg =  this.avgAttendance(day),
        percChange = change(priorAvg, currAvg, true);
    return percChange;
  }

  getClassAttendance(classId, date) {
    date = date || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    let self = this;
    return computed(() => {
      let attendance = self.db.store(
        'divisionClassAttendance', 
        [
          filter((x) => x.deletedAt === null && x.attendanceDate >= date && x.divisionClassId === classId)
        ]
      );
      if (attendance.length && attendance[0].count) {
        return attendance[0].count.toString();
      } else {
        return "0";
      }
    }).get();
  }

  async getClassAttendanceToday(classId) {
    let today = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD'));
    let records = await this.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.divisionClassId === classId && x.attendanceDate >= today)
          ]
        );
    return records;
  }

  getDailyAttendance(startMonth, endMonth) {
    startMonth = startMonth || moment(moment().format("MM/01/YYYY")+" 00:00:00").subtract(3, "month")
    endMonth = endMonth || moment(moment().format("MM/01/YYYY")+" 00:00:00").valueOf();
    let dailyAttendance = [],
        latest = this.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.attendanceDate >= startMonth && x.attendanceDate <= endMonth),
            sortBy('attendanceDate'),
            reverse
          ]
        ).reduce(
          function(map, d){
            map[d.attendanceDate] = (map[d.attendanceDate] || 0) + d.count;
            return map;
          },
          Object.create(null)
        ),
        avg = 0;
    Object.keys(latest).forEach(function(day, index) {
      dailyAttendance.push({
        date: parseInt(day, 10),
        count: latest[day]
      })
    });
    /*
    dailyAttendance = _.sortBy(dailyAttendance, function(day){
        return day.date * -1;
    });
    */
    //console.log(dailyAttendance);
    return dailyAttendance;
  }
  
  getClassAttendanceByDay(classId, day, begin, end) {
    begin = begin || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(8, "week").valueOf();
    end = end || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    let divisionClasses = this.db.store(
          'divisionClasses', 
          [
            filter((x) => x.deletedAt === null && x.classId === classId),
            map((x) => x.id)
          ]
        ),
        records = self.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.day === day && x.attendanceDate >= begin && x.attendanceDate <= end && (divisionClasses.indexOf(x.divisionClassId) > -1)),
            sortBy('attendanceDate')
          ]
        );
    return records;
  }

  getDayAttendance(date) {
    let self = this;
    return new Promise(function(resolve, reject){
      let dailyAttendance = [],
          attendance = self.db.store(
            'divisionClassAttendance', 
            [
              filter((x) => x.deletedAt === null && x.attendanceDate >= parseInt(date)),
              first
            ]
          ),
          division = self.db.store(
            'divisions', 
            [
              filter((x) => x.deletedAt === null && x.start <= parseInt(date) && x.end >= parseInt(date)),
              first
            ]
          ),
          divisionClasses = self.db.store(
            'divisionClasses', 
            [
              filter((x) => x.deletedAt === null && x.divisionId === division.id),
              first
            ]
          ),
          classes = self.db.store(
            'classes', 
            [
              sortBy('id')
            ]
          );

      self.db.eqJoin(
        divisionClasses, 
        classes, 
        'classId', 
        'id', 
        function (left, right) {
          return {
            divisionClassId: left.id,
            classId: left.classId,
            divisionClasses: left,
            class: right
          }
        }
      ).then(
        function(data) {
          data = sortBy(data)('divisionClassId');
          data.forEach(function(cls, index) {
            let classAttendance = find(attendance)({ 'divisionClassId': cls.divisionClassId }),
                divisionClassAttendance = (classAttendance) ? classAttendance : {count: 0, updatedAt: null};
            cls.divisionClassAttendance = divisionClassAttendance;
          });
          resolve(data);
        }
      );
    });
  }

  getCurrentDivision(now) {
    let self = this;
    return new Promise(function(resolve, reject){
      now = now || moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
      let record = self.db.store(
            'divisions', 
            [
              filter((x) => x.deletedAt === null && x.end >= now),
              sortBy('end'),
              first
            ]
          );
      resolve(record);
    });
  }
  
  getMeetingDay(day) {
    return this.db.store(
            'classMeetingDays', 
            [
              filter((x) => x.deletedAt === null && x.day === day),
            ]
          );
  }

  getCurrentDivisionMeetingDays(divisionConfig, today) {
    let self = this;
    return new Promise(function(resolve, reject){
      resolve(
        self.db.store(
          'classMeetingDays', 
          [
            filter((x) => x.deletedAt === null && x.day === today && x.divisionConfigId === divisionConfig.id)
          ]
        )
      );
    });
  }

  getDivisionMeetingDays(divisionConfigId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let records = self.db.store(
          'classMeetingDays', 
          [
            filter((x) => x.deletedAt === null && x.divisionConfigId === divisionConfigId)
          ]
        );
      resolve(records);
    });
  }

  getCurrentDivisionClasses(divisionId) {
    let self = this;
    return new Promise(function(resolve, reject){
      waterfall(
        [
          function(callback) {
            if (!divisionId) {
              let now = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
              self.getCurrentDivision(now).then(
                function(data) {
                  callback(null, data.id);
                }
              );
            } else {
              callback(null, divisionId);
            }
          }
        ],
        function(err, results) {
          let divisionClasses = self.db.store(
                'divisionClasses', 
                [
                  sortBy('classId')
                ]
              ),
              classes = self.db.store(
                'classes', 
                [
                  sortBy('id')
                ]
              );
          self.db.eqJoin(
            divisionClasses, 
            classes, 
            'classId', 
            'id', 
            function (left, right) {
              return {
                class: right,
                order: right.order,
                id: left.id,
                divisionClass: left
              }
            }
          ).then(
            function(data) {
              data = sortBy(x=>x.order)(data);
              resolve(data);
            }
          );
        }
      );
      
    });
  }

  getDivisionConfigClasses(divisionConfigId, date, dow) {
    let self = this;
    return new Promise(function(resolve, reject){
      date = date || moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
      dow = self.isNumeric(dow) ? dow : moment().weekday();
      waterfall(
        [
          function(callback) {
            self.getDivisionConfig(divisionConfigId).then(
              function(data) {
                callback(null, {divisionConfig: data});
              }
            );
          },
          function(store, callback) {
            self.getCurrentDivision(date).then(
              function(data) {
                store.division = data;
                callback(null, store);
              }
            );
          },
          function(store, callback) {
            self.getCurrentDivisionMeetingDays(store.divisionConfig, dow).then(
              function(data) {
                store.classDay = data;
                callback(null, store);
              }
            );
          },
          function(store, callback) {
            self.getCurrentDivisionClasses(store.division.id).then(
              function(data) {
                store.divClasses = data;
                callback(null, store);
              }
            );
          },
        ],
        function(err, store) {
          if (!Array.isArray(store.classDay) && store.classDay !== null) {
            store.classDay = [store.classDay];
          } else if (store.classDay === null) {
            store.classDay = [];
          }
          let results = store.classDay.map(function(day, index){
            day.classes = store.divClasses;
            day.config = store.divisionConfig;
          });
          resolve(store.classDay);
        }
      );
    });
  }

  getDivisionClass(divisionClassId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let divisionClasses = self.db.store(
                'divisionClasses', 
                [
                  filter((x) => x.deletedAt === null && x.id === divisionClassId),
                  sortBy('classId')
                ]
              ),
              classes = self.db.store(
                'classes', 
                [
                  sortBy('id')
                ]
              );
      self.db.eqJoin(
        divisionClasses, 
        classes, 
        'classId', 
        'id', 
        function (left, right) {
          return {
            order: right.order,
            class: right,
            divisionClass: left
          }
        }
      ).then(
        function(data) {
          data = sortBy(data)('order');
          resolve(data);
        }
      );
    });
  }

  getDivisionClassByDivAndClass(divisionId, classId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let divisionClasses = self.db.store(
            'divisionClasses', 
            [
              filter((x) => x.deletedAt === null && x.divisionId === divisionId && x.classId === classId),
              sortBy('classId')
            ]
          ),
          classes = self.db.store(
            'classes', 
            [
              sortBy('id')
            ]
          );
      self.db.eqJoin(
        divisionClasses, 
        classes, 
        'classId', 
        'id', 
        function (left, right) {
          return {
            order: right.order,
            class: right,
            divisionClass: left
          }
        }
      ).then(
        function(data) {
          resolve(data[0]);
        }
      );
    });
  }

  getCurrentClassTeachers(divisionClassId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let day = moment().weekday();
      let divisionClassTeachers = self.db.store(
            'divisionClassTeachers', 
            [
              filter((x) => x.deletedAt === null && x.day === day && x.divisionClassId === divisionClassId),
              sortBy('classId')
            ]
          ),
          people = self.db.store(
            'people', 
            []
          );
      self.db.eqJoin(
        divisionClassTeachers, 
        people, 
        'peopleId', 
        'id', 
        function (left, right) {
          return {
            person: right,
            divClassTeacher: left
          }
        }
      ).then(
        function(data) {
          resolve(data);
        }
      );
    });
  }

  getDivisionClassTeachers(divisionClassId, day) {
    let self = this;
    return new Promise(function(resolve, reject){
      let divisionClassTeachers = self.db.store(
            'divisionClassTeachers', 
            [
              filter((x) => x.deletedAt === null && x.day === day && x.divisionClassId === divisionClassId),
              sortBy('classId')
            ]
          ),
          people = self.db.store(
            'people', 
            []
          );
      self.db.eqJoin(
        divisionClassTeachers, 
        people, 
        'peopleId', 
        'id', 
        function (left, right) {
          return {
            id: left.id,
            person: right,
            divClassTeacher: left
          }
        }
      ).then(
        function(data) {
          resolve(data);
        }
      );
    });
  }

  async getClassMeetingDays() {
    return await this.db.store(
          'classMeetingDays', 
          [
            filter((x) => x.deletedAt === null),
            sortBy('day')
          ]
        );
  }

  async getClass(classId) {
    let cls = await this.db.store(
          'classes', 
          [
            filter((x) => x.deletedAt === null && x.id === classId),
            first
          ]
        );
    //console.log(getCurrentClassTeachers, teachers);
    return cls;
  }
  
  getClassTeachers(classId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let divisionClasses = self.db.store(
            'divisionClasses', 
            [
              sortBy('id')
            ]
          ),
          people = self.db.store(
            'people', 
            [
              sortBy('id')
            ]
          ),
          divisions = self.db.store(
            'divisions', 
            [
              sortBy('id')
            ]
          ),
          teachers = self.db.store(
            'teachers', 
            [
              filter((x) => x.deletedAt === null && x.divisionClassId === divisionClassId),
              sortBy('id')
            ]
          );
      waterfall(
          [
            function(callback) {
              self.db.eqJoin(
                divisionClassTeachers, 
                people, 
                'peopleId', 
                'id', 
                function (left, right) {
                  return {
                    person: right,
                    divisionClassId: left.divisionClassId,
                    divClassTeacher: left
                  }
                }
              ).then(
                function(data) {
                  callback(data);
                }
              );
            },
            function(result, callback) {
              self.db.eqJoin(
                result, 
                divisionClasses, 
                'divisionClassId', 
                'id', 
                function (left, right) {
                  return {
                    person: left.person,
                    divisionClassId: left.divisionClassId,
                    divClassTeacher: left.divClassTeacher,
                    divisionId: right.divisionId,
                    divClass: right
                  }
                }
              ).then(
                function(data) {
                  callback(data);
                }
              );
            },
            function(result, callback) {
              self.db.eqJoin(
                result, 
                divisions, 
                'divisionId', 
                'id', 
                function (left, right) {
                  return {
                    person: left.person,
                    personId: left.person.id,
                    divisionClassId: left.divisionClassId,
                    divClassTeacher: left.divClassTeacher,
                    divClass: left.divClass,
                    divisionId: left.divisionId,
                    division: right
                  }
                }
              ).then(
                function(data) {
                  callback(data);
                }
              );
            }
          ],
          function(err, results) {
            let uniq = results.reduce(function(a,b){
                  //console.log(a, b);
                  if (Array.isArray(a) && a.length === 0) {
                    a.push(b);
                  } else if (a.personId !== b.personId  ) {
                    a.push(b);
                  }
                  return a;
                },[]);
            //console.log("getClassTeachers", uniq);
            resolve(uniq);
          }
        );
    });
  }

  async getNotes() {
    let records = await this.db.store(
          'notes', 
          [
            filter((x) => x.deletedAt === null),
            sortBy('createdAt')
          ]
        );
    return records;
  }

  async findPeople(search, type) {
    let srch = {},
        regex = new RegExp('^'+search, "i");
    let records = await this.db.store(
          'people', 
          [
            filter((x) => x.deletedAt === null && x[type].search(regex)),
            sortBy(['lastName', 'firstName'])
          ]
        );
    return records;
  }

  async confirmTeacher(confirm, divClassId, teacherId) {
    let record = await this.db.store(
          'divisionClassTeachers', 
          [
            filter((x) => x.deletedAt === null && x.id === teacherId),
            first
          ]
        );
    if (record) {
      record = record.valueOf();
      record.confirmed = confirm;
      this.db.updateStore("divisionClassTeachers", record, false);
    }

  }

  async updateClassOrder(classId, currentPos, newPos) {
    let record = await this.db.store(
          'classes', 
          [
            filter((x) => x.deletedAt === null && x.id === classId),
            first
          ]
        );
    if (record) {
      record = record.valueOf();
      record.order = newPos;
      this.db.updateCollection("classes", record, false);
    }

  }

  updateClassAttendance(divisionClassId, now, count) {
    console.log("updateClassAttendance", moment().unix());

    let record = this.db.store(
          'divisionClassAttendance', 
          [
            filter((x) => x.deletedAt === null && x.attendanceDate === now && x.divisionClassId === divisionClassId),
            first
          ]
        );
    if (!record) {
      record = {
        attendanceDate: now,
        count: parseInt(count, 10),
        createdAt: null,
        day: moment(now, "x").weekday(),
        deletedAt: null,
        divisionClassId: divisionClassId,
        id: null,
        revision: null,
        updatedAt: null
      };
    } else {
      record = toJS(record);
      record.count = count;
    }
    console.log("updateClassAttendance:dispatch", moment().unix());
    return this.db.updateStore("divisionClassAttendance", record, false);
  }

  async updateClassDayTeacher(divisionClassId, day, peopleId) {
    let record = await this.db.store(
          'divisionClassTeachers', 
          [
            filter((x) => x.deletedAt === null && x.peopleId === peopleId && x.day === day && X.divisionClassId === divisionClassId),
            first
          ]
        );
    if (!record) {
      record = {
        peopleId: peopleId,
        day: day,
        divisionClassId: divisionClassId,
        confirmed: false,
        id: null,
        revision: null,
        updatedAt: null,
        createdAt: null,
        deletedAt: null
      };
    } else {
      record = toJS(record);
      record.peopleId = peopleId;
      record.day = day;
      record.divisionClassId = divisionClassId;
    }
    return await this.db.updateStore("divisionClassTeachers", record, false);
  }

  updateCollectionFields(collection, id, updates) {
    this.db.updateCollectionFields(collection, id, updates);
  }
}
