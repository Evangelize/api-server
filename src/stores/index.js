import each from 'async/each';
import { observable } from 'mobx';
import classes from './classes';
import Jobs from './jobs';
import Messages from './messages';
import People from './people';
import worship from './worship';
import settings from './settings';
import utils from './utils';

const modules = [
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
    if (db && events) {
      this.init(events);
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
