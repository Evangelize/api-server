import { extendObservable, observable, autorun, isObservable, isObservableMap, map, computed } from "mobx";
import _ from 'lodash';
import loki from 'lokijs';
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
      //console.log( this.db.collections.divisionConfigs.data);
      let records = self.db.collections.divisionConfigs.chain()
          .find({deletedAt: null})
          .data();
      //console.log("years", years);
      resolve(records);
    });
  }

  getDivisionConfig(id) {
    let self = this;
    return new Promise(function(resolve, reject){
      //console.log( this.db.collections.divisionConfigs.data);
      let record = self.db.collections.divisionConfigs
          .findOne(
            {
              id: id,
              deletedAt: null
            }
          );
      //console.log("years", years);
      resolve(record);
    });
  }
  
  async getClasses() {
    let classes = await this.db.collections.classes.chain()
        .find({deletedAt: null})
        .simplesort("order")
        .data();
    //console.log("years", years);
    return classes;
  }

  async getDivisionYears(divisionConfigId) {
    let years = await this.db.collections.divisionYears.chain()
        .find({$and:[{divisionConfigId: divisionConfigId}, {deletedAt: null}]})
        .simplesort("endDate")
        .data();
    //console.log("years", years);
    return years;
  }

  async getDivision(divisionId) {
    let division = await this.db.collections.divisions
        .findOne({$and:[{id: divisionId}, {deletedAt: null}]});
    //console.log("years", years);
    return division;
  }

  async getCurrentDivisionYear(divisionConfigId) {
    let now = moment().valueOf(),
        year = await this.db.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: divisionConfigId}, {deletedAt: null}]})
                .data();
    //console.log("year", year);
    return year[0];
  }

  async getDivisionScheduleOrdered(configId, yearId) {
    configId = configId || this.db.collections.divisionConfig.data[0];
    let now = moment().valueOf(),
        schedule, future = [], past = [];
    if (!yearId) {
      yearId = await this.db.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data()[0].id;
    }
    schedule = await this.db.collections.divisions.chain()
                .find({$and: [{divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data();

    schedule.forEach(function(div){
      if (moment(div.end).isSameOrAfter()) {
        future.push(div);
      } else {
        past.push(div);
      }
    });
    future = await _.sortBy(future, 'end');
    past = await _.sortBy(past, 'end');
    schedule = await future.concat(past)
    //console.log("schedule", schedule);
    return schedule;
  }

  async getDivisionSchedules(configId, yearId) {
    let schedules;
    schedules = await this.db.collections.divisions.chain()
                .find({$and: [{divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .simplesort("end")
                .data();
    return schedules;
  }

  async getCurrentDivisionSchedule(configId, yearId) {
    let now = moment().valueOf(),
        schedule;
    schedule = await this.db.collections.divisions.chain()
                .find({$and: [{end: {$gte: now}}, {start: {$lte: now}}, {divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data();
    return schedule;
  }

  async getDivisionSchedule(id) {
    let now = moment().valueOf(),
        schedule;
    schedule = await this.db.collections.divisions.chain()
                .find({$and: [{id: id}, {deletedAt: null}]})
                .data();
    return schedule;
  }

  latestAttendance(day, length) {
    //console.log(day, length);
    let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(length, "week").valueOf(),
        latest = this.db.collections.divisionClassAttendance.chain()
          .find({$and:[{attendanceDate: {$gte: now}}, {day: day}, {deletedAt: null}]})
          .simplesort("attendanceDate")
          .data()
          .reduce(
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

    let divClass = this.db.collections.divisionClassAttendance;
    let latest = this.db.collections.divisionClassAttendance.chain()
        .find({$and: [{attendanceDate: {$gte: begin}}, {attendanceDate: {$lte: end}}, {day: day}, {deletedAt: null}]})
        .simplesort("attendanceDate")
        .data()
        .reduce(
          function(map, day){
            map[day.attendanceDate] = (map[day.attendanceDate] || 0) + day.count;
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
      let attendance = self.db.collections.divisionClassAttendance.chain()
          .find(
            {
              $and: [
                {
                  attendanceDate: {$gte: date}
                },
                {
                  divisionClassId: {$eq: classId}
                },
                {
                  deletedAt: null
                }
              ]
            }
          )
          .data();
      if (attendance.length && attendance[0].count) {
        return attendance[0].count.toString();
      } else {
        return "0";
      }
    }).get();
  }

  async getClassAttendanceToday(classId) {
    let today = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')),
        attendance = await this.db.collections.divisionClassAttendance.chain()
        .find(
          {
            $and: [
              {
                attendanceDate: {$gte: today}
              },
              {
                divisionClassId: {$eq: classId}
              },
              {
                deletedAt: null
              }
            ]
          }
        )
        .data();
    return attendance;
  }

  getDailyAttendance(startMonth, endMonth) {
    startMonth = startMonth || moment(moment().format("MM/01/YYYY")+" 00:00:00").subtract(3, "month")
    endMonth = endMonth || moment(moment().format("MM/01/YYYY")+" 00:00:00").valueOf();
    let dailyAttendance = [],
        latest = this.db.collections.divisionClassAttendance.chain()
        .find({$and: [{attendanceDate: {$gte: startMonth}}, {attendanceDate: {$lte: endMonth}}, {deletedAt: null}]})
        .simplesort("attendanceDate", true)
        .data()
        .reduce(
          function(map, day){
            map[day.attendanceDate] = (map[day.attendanceDate] || 0) + day.count;
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
    let divisionClasses = this.db.collections.divisionClasses.chain()
        .find(
          {
            $and: [
              {classId: classId},
              {deletedAt: null}
             ]
           }
        )
        .data().map(function(cls, index){
          return cls.id;
        }),
        dailyAttendance = this.db.collections.divisionClassAttendance.chain()
        .find(
          {
            $and: [
              {divisionClassId: {$in: divisionClasses}},
              {day: day},
              {attendanceDate: {$gte: begin}}, 
              {attendanceDate: {$lte: end}}, 
              {deletedAt: null}
             ]
           }
        )
        .simplesort("attendanceDate")
        .data();
    return dailyAttendance;
  }

  async getDayAttendance(date) {
    let self = this,
        dailyAttendance = [],
        attendance = await this.db.collections.divisionClassAttendance.chain()
          .find({$and: [{attendanceDate: parseInt(date)}, {deletedAt: null}]})
          .data(),
        division = await this.db.collections.divisions.find({$and: [{start: {$lte: date}}, {end: {$gte: date}}, {deletedAt: null}]}),
        classes = await this.db.collections.divisionClasses.chain()
          .find({$and: [{divisionId: division[0].id}, {deletedAt: null}]})
          .eqJoin(self.db.collections.classes.data.toJS(), 'classId', 'id', function (left, right) {
            return {
              divisionClassId: left.id,
              classId: left.classId,
              divisionClasses: left,
              class: right
            }
          })
          .simplesort("divisionClassId")
          .data();
    classes.forEach(function(cls, index) {
      let classAttendance = _.find(attendance, { 'divisionClassId': cls.divisionClassId }),
          divisionClassAttendance = (classAttendance) ? classAttendance : {count: 0, updatedAt: null};
      cls.divisionClassAttendance = divisionClassAttendance;
    });
    
    return classes;
  }

  getCurrentDivision(now) {
    let self = this;
    return new Promise(function(resolve, reject){
      now = now || moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
      let div = self.db.collections.divisions.chain().find({$and:[{end: {$gte: now}}, {deletedAt: null}]}).simplesort('end').limit(1).data()[0];
      resolve(div);
    });
  }
  
  getMeetingDay(day) {
    return this.db.collections.classMeetingDays.find({
      $and: [
        {
          day: {
            $eq: day
          }
        },
        {
          deletedAt: null
        }
      ]
    });
  }

  getCurrentDivisionMeetingDays(divisionConfig, today) {
    let self = this;
    return new Promise(function(resolve, reject){
      resolve(
        self.db.collections.classMeetingDays.find({
          $and: [
            {
              day: {
                $eq: today
              }
            },
            {
              divisionConfigId: {
                $eq: divisionConfig.id
              }
            },
            {
              deletedAt: null
            }
          ]
        })
      );
    });
  }

  async getDivisionMeetingDays(divisionConfigId) {
    return await this.db.collections.classMeetingDays.find({
      $and: [
        {
          divisionConfigId: {
            $eq: divisionConfigId
          }
        },
        {
          deletedAt: null
        }
      ]
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

          resolve(
            self.db.collections.divisionClasses
            .chain()
            .find({$and:[{divisionId: results}, {deletedAt: null}]})
            .eqJoin(self.db.collections.classes.data.toJS(), 'classId', 'id', function (left, right) {
              return {
                class: right,
                order: right.order,
                id: left.id,
                divisionClass: left
              }
            })
            .simplesort("order")
            .data()
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
      let divClass = self.db.collections.divisionClasses
            .chain()
            .find(
              {
                $and:[
                  {
                    id: divisionClassId
                  },
                  {
                    deletedAt: null
                  }
                ]
              }
            )
            .eqJoin(self.db.collections.classes.data.toJS(), 'classId', 'id', function (left, right) {
              return {
                class: right,
                divisionClass: left
              }
            }).data();
      //console.log(divClass);
      resolve(divClass[0]);
    });
  }

  async getDivisionClassByDivAndClass(divisionId, classId) {
    //console.log("getCurrentDivisionClasses", divisionClassId);
    let self = this,
        divClass = await this.db.collections.divisionClasses
          .chain()
          .find(
            {
              $and:[
                {
                  divisionId: divisionId
                },
                {
                  classId: classId
                },
                {
                  deletedAt: null
                }
              ]
            }
          )
          .eqJoin(self.db.collections.classes.data.toJS(), 'classId', 'id', function (left, right) {
            return {
              class: right,
              divisionClass: left
            }
          }).data();
    //console.log(divClass);
    return divClass[0];
  }

  getCurrentClassTeachers(divisionClassId) {
    let self = this;
    return new Promise(function(resolve, reject){
      let day = moment().weekday(),
          teachers = self.db.collections.divisionClassTeachers
            .chain()
            .find(
              {
                $and: [
                  {divisionClassId: divisionClassId},
                  {day: day},
                  {deletedAt: null}
                ]
              }
            )
            .eqJoin(self.db.collections.people.data.toJS(), 'peopleId', 'id', function (left, right) {
              return {
                person: right,
                divClassTeacher: left
              }
            }).data();
      //console.log(getCurrentClassTeachers, teachers);
      resolve(teachers);
    });
  }

  async getDivisionClassTeachers(divisionClassId, day) {
    let teachers = await this.db.collections.divisionClassTeachers
          .chain()
          .find(
            {
              $and: [
                {divisionClassId: divisionClassId},
                {day: day},
                {deletedAt: null}
              ]
            }
          )
          .eqJoin(this.db.collections.people.data.toJS(), 'peopleId', 'id', function (left, right) {
            return {
              person: right,
              divClassTeacher: left
            }
          }).data();
    //console.log(getCurrentClassTeachers, teachers);
    return teachers;
  }

  async getClassMeetingDays() {
    return await this.db.collections.classMeetingDays.chain().find({deletedAt: null}).simplesort("day").data();
  }

  async getClass(classId) {
    let cls = await this.db.collections.classes
          .findOne(
            {
              $and: [
                {id: classId},
                {deletedAt: null}
              ]
            }
          );
    //console.log(getCurrentClassTeachers, teachers);
    return cls;
  }
  
  async getClassTeachers(classId) {
    let divisionClasses = await this.db.collections.divisionClasses.chain()
        .find(
          {
            $and: [
              {classId: classId},
              {deletedAt: null}
             ]
           }
        )
        .data().map(function(cls, index){
          return cls.id;
        });
       
    let teachers = await this.db.collections.divisionClassTeachers
          .chain()
          .find(
            {
              $and: [
                {divisionClassId: {$in: divisionClasses}},
                {deletedAt: null}
              ]
            }
          )
          .simplesort("createdAt", true)
          .eqJoin(this.db.collections.people.data.toJS(), 'peopleId', 'id', function (left, right) {
            return {
              person: right,
              divisionClassId: left.divisionClassId,
              divClassTeacher: left
            }
          })
          .eqJoin(this.db.collections.divisionClasses.data.toJS(), 'divisionClassId', 'id', function (left, right) {
            return { 
              person: left.person,
              divisionClassId: left.divisionClassId,
              divClassTeacher: left.divClassTeacher,
              divisionId: right.divisionId,
              divClass: right
            };
          })
          .eqJoin(this.db.collections.divisions.data.toJS(), 'divisionId', 'id', function (left, right) {
            return { 
              person: left.person,
              personId: left.person.id,
              divisionClassId: left.divisionClassId,
              divClassTeacher: left.divClassTeacher,
              divClass: left.divClass,
              divisionId: left.divisionId,
              division: right
            };
          })
          .data();
    let uniq = await teachers.reduce(function(a,b){
          //console.log(a, b);
          if (Array.isArray(a) && a.length === 0) {
            a.push(b);
          } else if (a.personId !== b.personId  ) {
            a.push(b);
          }
          return a;
        },[]);
    //console.log("getClassTeachers", uniq);
    return uniq;
  }

  getNotes() {
    let results = this.db.collections.notes.chain().find({deletedAt: null}).simplesort('createdAt').data();
    return results;
  }

  async findPeople(search, type) {
    let srch = {},
        regex = new RegExp('^'+search, "i");
    srch[type] = {$regex: regex};
    let people = await this.db.collections.people
          .chain()
          .find(
            {
              $and: [
                srch,
                {deletedAt: null}
              ]
            }
          ).data();
    return people;
  }

  async confirmTeacher(confirm, divClassId, teacherId) {
    let record = await this.db.collections.divisionClassTeachers
                .findOne(
                  {
                    $and: [
                      {
                        id: teacherId
                      },
                      {
                        deletedAt: null
                      }
                    ]
                  }
                );
    if (record) {
      record = record.valueOf();
      record.confirmed = confirm;
      this.db.updateCollection("divisionClassTeachers", record, false);
    }

  }

  async updateClassOrder(classId, currentPos, newPos) {
    let record = await this.db.collections.classes
                .findOne(
                  {
                    $and: [
                      {
                        id: classId
                      },
                      {
                        deletedAt: null
                      }
                    ]
                  }
                );
    if (record) {
      record = record.valueOf();
      record.order = newPos;
      this.db.updateCollection("classes", record, false);
    }

  }

  async updateClassAttendance(divisionClassId, now, count) {
    console.log("updateClassAttendance", moment().unix());
    let record = await this.db.collections.divisionClassAttendance
                .findOne(
                  {
                    $and: [
                      {
                        attendanceDate: now
                      },
                      {
                        divisionClassId: divisionClassId
                      },
                      {
                        deletedAt: null
                      }
                    ]
                  }
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
      record = await record.valueOf();
      record.count = count;
    }
    console.log("updateClassAttendance:dispatch", moment().unix());
    return await this.db.updateCollection("divisionClassAttendance", record, false);
  }

  async updateClassDayTeacher(divisionClassId, day, peopleId) {
    let record = await this.db.collections.divisionClassTeachers
                .findOne(
                  {
                    $and: [
                      {
                        peopleId: peopleId
                      },
                      {
                        day: day
                      },
                      {
                        divisionClassId: divisionClassId
                      },
                      {
                        deletedAt: null
                      }
                    ]
                  }
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
      record = record.valueOf();
      record.peopleId = peopleId;
      record.day = day;
      record.divisionClassId = divisionClassId;
    }
    return await this.db.updateCollection("divisionClassTeachers", record, false);
  }

  updateCollectionFields(collection, id, updates) {
    this.db.updateCollectionFields(collection, id, updates);
  }
}
