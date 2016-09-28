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
import axios from 'axios';
import Promise from 'bluebird';

export default class Utils {
  @observable db;
  @observable events;
  @observable isUpdating = false;

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

  importUsers(data, families, people, reset) {
    return axios.post(
      '/api/import',
      {
        data,
        families,
        people,
        reset,
      }
    )
    .then(
      (response) => Promise.resolve(response.data)
    )
    .catch(
      (response) => Promise.resolve(response.data)
    );
  }
}