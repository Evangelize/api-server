import each from 'async/each';
import { observable } from 'mobx';
import classes from './classes';
import Messages from './messages';
import worship from './worship';
import settings from './settings';
import utils from './utils';

const modules = {
  classes,
  Messages,
  worship,
  settings,
  utils,
};

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
          self.stores[Mod.name.toLowerCase()] = new Mod(db, events);
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
