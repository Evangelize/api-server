import {
  observable,
  autorun,
  computed,
  toJS,
  action,
  extendObservable
} from 'mobx';
import {
  filter,
  sortBy,
  orderBy,
  first,
  map,
  reverse,
  find,
  uniqueId,
  pick,
  uniqBy
} from 'lodash/fp';
import moment from 'moment-timezone';
import waterfall from 'async/waterfall';
import change from 'percent-change';
import Promise from 'bluebird';

export default class Worship {
  @observable db;
  @observable events;

  constructor(db, events) {
    if (db) {
      this.setupDb(db);
    }
    if (events) {
      this.setupEvents(events);
    }
  }

  setupDb(db) {
    this.db = db;
  }

  setupEvents(events) {
    this.events = events;
  }

  isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }

  @action updateCollectionFields(collection, id, updates) {
    return this.db.updateCollectionFields(collection, id, updates);
  }

  @action deleteRecord(collection, id) {
    return this.db.deleteRecord(collection, id);
  }

  getServices() {
    return this.db.store(
      'worshipServices', [
        filter((rec) => rec.deletedAt === null),
        orderBy(['day', 'time'], ['asc']),
      ]
    );
  }

  getService(id) {
    return this.db.store(
      'worshipServices', [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
  }

  getMonthServiceDays(month, year) {
    let days = [];
    const uniqueDays = this.db.store(
      'worshipServices', [
        filter((rec) => rec.deletedAt === null),
        uniqBy('day'),
        orderBy(['day'], ['asc']),
      ]
    );

    uniqueDays.forEach((day) => {
      let dow = moment(`${year}${month}01`).startOf('month').day(day.day);
      while (month !== dow.format('MM') || day.day !== dow.day()) {
        dow = dow.add(1, 'days');
      }

      while (month === dow.format('MM')) {
        days.push(dow.valueOf());
        dow = dow.add(1, 'weeks');
      }
    });

    days = days.sort((a, b) => a - b);
    return days;
  }

  getServicesByDate(date) {
    const day = moment(date).day();
    return this.db.store(
      'worshipServices', [
        filter((rec) => rec.deletedAt === null && rec.day === day),
        orderBy(['day', 'time'], ['asc']),
      ]
    );
  }

  @action updateServiceOrder(id, currentPos, newPos) {
    let record = this.db.store(
      'worshipServices', [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
    if (record) {
      record = record.valueOf();
      record.order = newPos;
      this.db.updateStore('worshipServices', record, false);
    }
  }

  @action updateWorshipService(id, data, add) {
    let retVal = null;
    const ts = moment();
    if (add) {
      const newRecord = Object.assign(
        {}, 
        {
          id: null,
          revision: null,
          createdAt: ts,
          updatedAt: ts,
          deletedAt: null,
        },
        data,
      );
      retVal = this.db.updateStore('worshipServices', newRecord, false);
    } else {
      const record = this.db.store(
        'worshipServices', [
          filter((rec) => rec.deletedAt === null &&
            rec.id === id
          ),
          first,
        ]
      );
      if (record) {
        retVal = this.deleteRecord('worshipServices', record.id);
      }
    }
    return retVal;
  }

  getAttendanceByService(startMonth, endMonth) {
    startMonth = startMonth || moment(moment().format('MM/01/YYYY') + ' 00:00:00').subtract(3, 'month');
    endMonth = endMonth || moment(moment().format('MM/01/YYYY') + ' 00:00:00').valueOf();
    let dailyAttendance = [];
    let latest = this.db.store(
      'memberAttendance', [
        filter((rec) => rec.deletedAt === null && rec.attendanceDate >= startMonth && rec.attendanceDate <= endMonth),
        sortBy('attendanceDate'),
        reverse,
      ]
    );
    latest = latest.reduce(
      (map, d) => {
        map[`${d.attendanceDate}|${d.worshipServiceId}`] = (map[`${d.attendanceDate}|${d.worshipServiceId}`] || 0) + d.count;
        return map;
      },
      Object.create(null)
    );
    Object.keys(latest).forEach((day) => {
      dailyAttendance.push({
        date: day,
        count: latest[day],
      });
    });
    /*
    dailyAttendance = _.sortBy(dailyAttendance, function(day){
        return day.date * -1;
    });
    */
    //console.log(dailyAttendance);
    return dailyAttendance;
  }

  getPersonWorshipAttendance(worshipDate, type, worshipServiceId, personId) {
    return this.db.store(
      'memberAttendance', [
        find((rec) => rec.deletedAt === null && 
          rec.attendanceDate === worshipDate && 
          rec.attendanceTypeId <= type &&
          rec.worshipServiceId === worshipServiceId &&
          rec.personId === personId
        ),
      ]
    );
  }
}