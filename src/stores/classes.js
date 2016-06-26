import { extendObservable, observable, autorun, isObservable, isObservableMap, map } from "mobx";
import _ from 'lodash';
import loki from 'lokijs';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';
import change from 'percent-change';

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

    this.ws.on('changes', data => {
      //console.log('changes', data);
      self.wsHandler(self.ws, data);
    });

    this.ws.on('global', data => {
      //console.log('global', data);
      //self.wsHandler(self.ws, data);
    });

    this.ws.on('connect', () => {
      //console.log("websocket: connected");
    });

    this.ws.on('error', err => {
      self.wsError(err);
    });
    
    this.ws.on('disconnect', () => {
      console.log("disconnect");
    });
  }

  isClassDay(divisionConfig) {
     let today = moment().weekday(),
         classDay = this.getMeetingDay(today);
        
     return (classDay) ? true : false;
  }

  getDivisionConfigs() {
    //console.log( this.db.collections.divisionConfigs.data);
    let records = this.db.collections.divisionConfigs.chain()
        .find({deletedAt: null})
        .data();
    //console.log("years", years);
    return records;
  }
  
  getClasses() {
    let classes = this.db.collections.classes.chain()
        .find({deletedAt: null})
        .simplesort("order")
        .data();
    //console.log("years", years);
    return classes;
  }

  getDivisionYears(divisionConfigId) {
    let years = this.db.collections.divisionYears.chain()
        .find({$and:[{divisionConfigId: divisionConfigId}, {deletedAt: null}]})
        .simplesort("endDate")
        .data();
    //console.log("years", years);
    return years;
  }

  getDivision(divisionId) {
    let division = this.db.collections.divisions
        .findOne({$and:[{id: divisionId}, {deletedAt: null}]});
    //console.log("years", years);
    return division;
  }

  getCurrentDivisionYear(divisionConfigId) {
    let now = moment().valueOf(),
        year = this.db.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: divisionConfigId}, {deletedAt: null}]})
                .data();
    //console.log("year", year);
    return year[0];
  }

  getDivisionScheduleOrdered(configId, yearId) {
    configId = configId || this.db.collections.divisionConfig.data[0];
    let now = moment().valueOf(),
        schedule, future = [], past = [];
    if (!yearId) {
      yearId = this.db.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data()[0].id;
    }
    schedule = this.db.collections.divisions.chain()
                .find({$and: [{divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data();

    schedule.forEach(function(div){
      if (moment(div.end).isSameOrAfter()) {
        future.push(div);
      } else {
        past.push(div);
      }
    });
    future = _.sortBy(future, 'end');
    past = _.sortBy(past, 'end');
    schedule = future.concat(past)
    //console.log("schedule", schedule);
    return schedule;
  }

  getDivisionSchedules(configId, yearId) {
    let schedules;
    schedules = this.db.collections.divisions.chain()
                .find({$and: [{divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .simplesort("end")
                .data();
    return schedules;
  }

  getCurrentDivisionSchedule(configId, yearId) {
    let now = moment().valueOf(),
        schedule;
    schedule = this.db.collections.divisions.chain()
                .find({$and: [{end: {$gte: now}}, {start: {$lte: now}}, {divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data();
    return schedule;
  }

  getDivisionSchedule(id) {
    let now = moment().valueOf(),
        schedule;
    schedule = this.db.collections.divisions.chain()
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
          );
    return Object.keys(latest).map(function(k) { return {attendance: latest[k], attendanceDate: parseInt(k, 10)}; });
  }

  avgAttendance(day, begin, end) {
    let divClass = this.db.collections.divisionClassAttendance;
    day = day || 0;
    begin = begin || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(4, "week").valueOf();
    end = end || moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss')).valueOf();

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
    let divClass = this.db.collections.divisionClassAttendance;
    day = day || 0;

    let priorBegin = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(8, "week").valueOf(),
        priorEnd = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss')).subtract(4, "week").valueOf(),
        priorAvg =  this.avgAttendance(day, priorBegin, priorEnd),
        currAvg =  this.avgAttendance(day),
        percChange = change(priorAvg, currAvg, true);
    return percChange;
  }

  getClassAttendanceToday(classId) {
    let today = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')),
        attendance = this.db.collections.divisionClassAttendance.chain()
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

  getDayAttendance(date) {
    let self = this,
        dailyAttendance = [],
        attendance = this.db.collections.divisionClassAttendance.chain()
          .find({$and: [{attendanceDate: parseInt(date)}, {deletedAt: null}]})
          .data(),
        division = this.db.collections.divisions.find({$and: [{start: {$lte: date}}, {end: {$gte: date}}, {deletedAt: null}]}),
        classes = this.db.collections.divisionClasses.chain()
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
    now = now || moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    let div = this.db.collections.divisions.chain().find({$and:[{end: {$gte: now}}, {deletedAt: null}]}).simplesort('end').limit(1).data()[0];
    return div;
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
    return this.db.collections.classMeetingDays.find({
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
    });
  }

  getDivisionMeetingDays(divisionConfigId) {
    return this.db.collections.classMeetingDays.find({
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
    //console.log("getCurrentDivisionClasses", divisionId);
    let self = this;
    return this.db.collections.divisionClasses
    .chain()
    .find({$and:[{divisionId: divisionId}, {deletedAt: null}]})
    .eqJoin(self.db.collections.classes.data.toJS(), 'classId', 'id', function (left, right) {
      return {
        class: right,
        order: right.order,
        divisionClass: left
      }
    })
    .simplesort("order")
    .data();
  }

  getDivisionClass(divisionClassId) {
    //console.log("getCurrentDivisionClasses", divisionClassId);
    let self = this,
        divClass = this.db.collections.divisionClasses
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
    return divClass[0];
  }

  getDivisionClassByDivAndClass(divisionId, classId) {
    //console.log("getCurrentDivisionClasses", divisionClassId);
    let self = this,
        divClass = this.db.collections.divisionClasses
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
    let day = moment().weekday(),
        teachers = this.db.collections.divisionClassTeachers
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

  getDivisionClassTeachers(divisionClassId, day) {
    let teachers = this.db.collections.divisionClassTeachers
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

  getClassMeetingDays() {
    return this.db.collections.classMeetingDays.chain().find({deletedAt: null}).simplesort("day").data();
  }

  getClass(classId) {
    let cls = this.db.collections.classes
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
  
  getClassTeachers(classId) {
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
        });
       
    let teachers = this.db.collections.divisionClassTeachers
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
    let uniq = teachers.reduce(function(a,b){
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

  findPeople(search, type) {
    let srch = {},
        regex = new RegExp('^'+search, "i");
    srch[type] = {$regex: regex};
    let people = this.db.collections.people
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

  confirmTeacher(confirm, divClassId, teacherId) {
    let record = this.db.collections.divisionClassTeachers
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

  updateClassOrder(classId, currentPos, newPos) {
    let record = this.db.collections.classes
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

  updateCollectionFields(collection, id, updates) {
    this.db.updateCollectionFields(collection, id, updates);
  }

  deleteRecord(collection, id) {
    this.db.updateCollectionFields(collection, id);
  }

  insertDocument(collection, record) {
    return this.db.collections[collection].insert(record);
  }

  updateClassAttendance(divisionClassId, now, count) {
    let record = this.db.collections.divisionClassAttendance
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
      record = record.valueOf();
      record.count = count;
    }
    this.db.updateCollection("divisionClassAttendance", record, false);
  }

  updateClassDayTeacher(divisionClassId, day, peopleId) {
    let record = this.db.collections.divisionClassTeachers
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
    this.db.updateCollection("divisionClassTeachers", record, false);
  }
}
