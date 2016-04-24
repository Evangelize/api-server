import { extendObservable, observable, autorun, isObservable, isObservableMap, map } from "mobx";
import _ from 'lodash';
import loki from 'lokijs';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';

export default class Classes {
  db;
  ws;
  collections = {};
  @observable peopleFilter;
  constructor(data, websocket) {
    this.db = new loki('classes');
    let self = this;
    if (websocket) {
      this.ws = websocket;

      this.ws.on('changes', data => {
        console.log('changes', data);
        self.wsHandler(self.ws, data);
      });

      this.ws.on('global', data => {
        console.log('global', data);
        //self.wsHandler(self.ws, data);
      });

      this.ws.on('connect', () => {
        console.log("websocket: connected");
      });

      this.ws.on('error', err => {
        self.wsError(err);
      });
    }

    Object.keys(data).map(function(key) {
      //console.log("collection", key, data[key]);
      let coll = self.db.addCollection(key,{asyncListeners: true, disableChangesApi: false, clone: false});
      self.collections[key] = coll;
      extendObservable(self.collections[key], {data: coll.data})
      if ("$loki" in data[key][0]) {
        coll.update(data[key]);
      } else {
        coll.insert(data[key]);
      }
      //data[coll.name] = coll.data;
      //coll.on('update', ((...args)=>self.collectionChange(coll.name, 'update', ...args)));
      //coll.on('insert', ((...args)=>self.collectionChange(coll.name, 'insert', ...args)));
    });
    //extendObservable(this, {data: data});

  }

  collectionChange(collection, type, target) {
    console.log(collection, type, target);
  }

  wsHandler(ws, update) {
    let data = update.payload.data,
        record;
    console.log("websocket:", ws);
    console.log("websocket update:", update);
    if (data.type === "insert" || data.type === "update" || data.type === "delete") {
      record = this.collections[data.collection]
                .findOne(
                  {
                    $and: [
                      {
                        id: data.record.id
                      }
                    ]
                  }
                );
      if (record) {
        let deleted = (data.type === "delete") ? true : false;
        record = Object.assign(record, data.record);
        this.updateCollection(data.collection, record, true, deleted);
      } else if (data.type !== "delete") {
        this.insertDocument(data.collection, data.record);
      }

    }
  }

  wsError(err) {
    console.log("websocket error:", err);
  }

  getDivisionConfigs() {
    //console.log( this.collections.divisionConfigs.data);
    return this.collections.divisionConfigs.data;
  }

  getDivisionYears(divisionConfigId) {
    let years = this.collections.divisionYears.chain()
        .find({$and:[{divisionConfigId: divisionConfigId}, {deletedAt: null}]})
        .simplesort("endDate")
        .data();
    //console.log("years", years);
    return years;
  }

  getDivision(divisionId) {
    let division = this.collections.divisions.chain()
        .find({$and:[{id: divisionId}, {deletedAt: null}]})
        .data();
    //console.log("years", years);
    return division[0];
  }

  getCurrentDivisionYear(divisionConfigId) {
    let now = moment().valueOf(),
        year = this.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: divisionConfigId}, {deletedAt: null}]})
                .data();
    console.log("year", year);
    return year[0];
  }

  getDivisionScheduleOrdered(configId, yearId) {
    configId = configId || this.collections.divisionConfig.data[0];
    let now = moment().valueOf(),
        schedule, future = [], past = [];
    if (!yearId) {
      yearId = this.collections.divisionYears.chain()
                .find({$and: [{endDate: {$gte: now}}, {startDate: {$lte: now}}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data()[0].id;
    }
    schedule = this.collections.divisions.chain()
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
    console.log("schedule", schedule);
    return schedule;
  }

  getDivisionSchedules(configId, yearId) {
    let schedules;
    schedules = this.collections.divisions.chain()
                .find({$and: [{divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .simplesort("end")
                .data();
    return schedules;
  }

  getCurrentDivisionSchedule(configId, yearId) {
    let now = moment().valueOf(),
        schedule;
    schedule = this.collections.divisions.chain()
                .find({$and: [{end: {$gte: now}}, {start: {$lte: now}}, {divisionYear: yearId}, {divisionConfigId: configId}, {deletedAt: null}]})
                .data();
    return schedule;
  }

  getDivisionSchedule(id) {
    let now = moment().valueOf(),
        schedule;
    schedule = this.collections.divisions.chain()
                .find({$and: [{id: id}, {deletedAt: null}]})
                .data();
    return schedule;
  }

  latestAttendance(day, length) {
    console.log(day, length);
    let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(length, "week").valueOf(),
        latest = this.collections.divisionClassAttendance.chain()
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

  avgAttendance(day) {
    let divClass = this.collections.divisionClassAttendance;
    day = day || 0;

    let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(4, "week").valueOf(),
        latest = this.collections.divisionClassAttendance.chain()
        .find({$and: [{attendanceDate: {$gte: now}}, {day: day}, {deletedAt: null}]})
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

  getClassAttendanceToday(classId) {
    let today = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')),
        attendance = this.collections.divisionClassAttendance.chain()
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

  getDailyAttendance(endMonth) {
    endMonth = endMonth || moment(moment().format("MM/01/YYYY")+" 00:00:00").valueOf();
    let dailyAttendance = [],
        startMonth = moment(endMonth).subtract(3, "month"),
        latest = this.collections.divisionClassAttendance.chain()
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
    console.log(dailyAttendance);
    return dailyAttendance;
  }

  getDayAttendance(date) {
    let self = this,
        dailyAttendance = [],
        latest = this.collections.divisionClassAttendance.chain()
        .find({$and: [{attendanceDate: date}, {deletedAt: null}]})
        .simplesort("divisionClassId")
        .eqJoin(self.collections.divisionClasses.data.toJSON(), 'classId', 'id', function (left, right) {
          return {
            divisionClassAttendance: right,
            divisionClasses: left
          }
        })
        .eqJoin(self.collections.divisionClasses.data.toJSON(), 'divisionClassId', 'id', function (left, right) {
          return Object.assign({}, left, right, {divisionClassAttendanceId: left.id })
        })
        .eqJoin(self.collections.classes.data.toJSON(), 'classId', 'id', function (left, right) {
          return Object.assign({}, left, right, {classId: right.id })
        });
    console.log(latest);
    return latest;
  }

  getCurrentDivision(now) {
    let div = this.collections.divisions.chain().find({$and:[{end: {$gte: now}}, {deletedAt: null}]}).simplesort('end').limit(1).data()[0];
    return div;
  }

  getCurrentDivisionMeetingDays(divisionConfig, today) {
    return this.collections.classMeetingDays.find({
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
    return this.collections.classMeetingDays.find({
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
    return this.collections.divisionClasses
    .chain()
    .find({$and:[{divisionId: divisionId}, {deletedAt: null}]})
    .eqJoin(self.collections.classes.data.toJSON(), 'classId', 'id', function (left, right) {
      return {
        class: right,
        divisionClass: left
      }
    }).data();
  }

  getDivisionClass(divisionClassId) {
    //console.log("getCurrentDivisionClasses", divisionClassId);
    let self = this,
        divClass = this.collections.divisionClasses
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
          .eqJoin(self.collections.classes.data.toJSON(), 'classId', 'id', function (left, right) {
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
        teachers = this.collections.divisionClassTeachers
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
          .eqJoin(this.collections.people.data.toJSON(), 'peopleId', 'id', function (left, right) {
            return {
              person: right,
              divClassTeacher: left
            }
          }).data();
    //console.log(getCurrentClassTeachers, teachers);
    return teachers;
  }

  getDivisionClassTeachers(divisionClassId, day) {
    let teachers = this.collections.divisionClassTeachers
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
          .eqJoin(this.collections.people.data.toJSON(), 'peopleId', 'id', function (left, right) {
            return {
              person: right,
              divClassTeacher: left
            }
          }).data();
    //console.log(getCurrentClassTeachers, teachers);
    return teachers;
  }

  getClassMeetingDays() {
    return this.collections.classMeetingDays.data.toJSON();
  }

  getClass(classId) {
    let cls = this.collections.classes
          .chain()
          .find(
            {
              $and: [
                {id: classId},
                {deletedAt: null}
              ]
            }
          ).data();
    //console.log(getCurrentClassTeachers, teachers);
    return cls;
  }

  getNotes() {
    let results = this.collections.notes.chain().find({deletedAt: null}).simplesort('createdAt').data();
    return results;
  }

  findPeople(search, type) {
    let srch = {},
        regex = new RegExp('^'+search, "i");
    srch[type] = {$regex: regex};
    let people = this.collections.people
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
    let record = this.collections.divisionClassTeachers
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
      this.updateCollection("divisionClassTeachers", record, false);
    }

  }

  deleteRecord(collection, id) {
    const ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    let record = this.collections[collection]
                .findOne(
                  {
                    $and: [
                      {
                        id: id
                      }
                    ]
                  }
                );
    if (record) {
      record.deletedAt = ts;
      this.updateCollection(collection, record, false, true);
    }
  }

  updateCollection(collection, record, remote, deleted) {
    deleted = deleted || false;
    remote = remote || false;
    const ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    let results, type = 'insert';
    if (record) {
      if (record.id) {
        type = (deleted) ? 'delete' : 'update';
        record.updatedAt = ts;
        if (deleted) {
          this.collections[collection].remove(record);
          results = record;
        } else {
          results = this.collections[collection].update(record);
        }
      } else {
        record.createdAt = ts;
        record.updatedAt = ts;
        record.id = iouuid.generate().toLowerCase();
        results = this.insertDocument(collection, record);
      }

      if (!remote) {
        this.ws.emit(
          type,
          {
            type: type,
            collection: collection,
            target: results
          }
        );
      }
    }
  }

  insertDocument(collection, record) {
    return this.collections[collection].insert(record);
  }

  updateClassAttendance(divisionClassId, now, count) {
    console.log("delayedAttendanceUpdate", count);
    let record = this.collections.divisionClassAttendance
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
    this.updateCollection("divisionClassAttendance", record, false);
  }

  updateClassDayTeacher(divisionClassId, day, peopleId) {
    let record = this.collections.divisionClassTeachers
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
    this.updateCollection("divisionClassTeachers", record, false);
  }
}
