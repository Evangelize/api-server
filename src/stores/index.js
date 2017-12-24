import each from 'async/each';
import { observable } from 'mobx';
import auth from './auth';
import classes from './classes';
import Jobs from './jobs';
import Messages from './messages';
import People from './people';
import worship from './worship';
import settings from './settings';
import utils from './utils';

const modules = [
  {
    name: 'auth',
    klass: auth,
  },
  {
    name: 'classes',
    klass: classes,
  },
  {
    name: 'jobs',
    klass: Jobs,
  },
  {
    name: 'messages',
    klass: Messages,
  },
  {
    name: 'people',
    klass: People,
  },
  {
    name: 'worship',
    klass: worship,
  },
  {
    name: 'settings',
    klass: settings,
  },
  {
    name: 'utils',
    klass: utils,
  },
];

export default class {
  @observable stores = {};
  constructor(db, events) {
    const self = this;
    if (db && events) {
      this.init(events)
      .then((data) => {
        self.stores.auth.setupAuth(window.user);
      });
    }
  }

  init = (db, events) => {
    const self = this;
    return new Promise((resolve, reject) => {
      each(
        modules,
        (Mod, cb) => {
          self.stores[Mod.name.toLowerCase()] = new Mod.klass(db, events);
          cb();
        },
        (err) => {
          if (err) reject(err);
          resolve(self.stores);
        }
      )
    });
  }
};
