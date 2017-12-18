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

const personModel = {
  entityId: null,
  familyId: null,
  cohortId: null,
  lastName: null,
  firstName: null,
  familyPosition: null,
  gender: null,
  homePhoneNumber: null,
  workPhoneNumber: null,
  cellPhoneNumber: null,
  emailAddress: null,
  birthday: null,
  nonChristian: 'n',
  nonMember: 'n',
  membershipStatus: null,
  deceased: 'n',
  collegeStudent: 'n',
  photoUrl: null,
  employer: null,
  occupation: null,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
};


export default class People {
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

  findPeople(search, type) {
    const regex = new RegExp('^' + search, 'i');
    return this.db.store(
      'people', [
        filter((rec) => rec.deletedAt === null && regex.test(rec[type])),
        sortBy(['lastName', 'firstName']),
      ]
    );
  }

  findFamilies(search) {
    const regex = new RegExp('^' + search, 'i');
    return this.db.store(
      'families', [
        filter((rec) => rec.deletedAt === null && regex.test(rec.name)),
        sortBy(['name']),
      ]
    );
  }

  getFamily(id) {
    return this.db.store(
      'families', [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
  }

  getPerson(id) {
    return this.db.store(
      'people', [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
  }

  @action addPerson(person) {
    return this.db.updateStore('people', person, false, false);
  }
}