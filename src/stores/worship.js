import {
  observable,
  autorun,
  computed,
  toJS,
  action
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
        orderBy(['day', 'time'], ['desc']),
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
}