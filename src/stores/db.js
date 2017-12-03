import { extendObservable, observable, autorun, isObservable, isObservableMap, map, action, runInAction, toJS } from 'mobx';
import { filter, pick, sortBy, first, take, remove } from 'lodash/fp';
import each from 'async/each';
import waterfall from 'async/waterfall';
import mobxstore from 'mobx-store';
import moment from 'moment-timezone';
import iouuid from 'innodb-optimized-uuid';
import Promise from 'bluebird';
import task from 'task.js';
import 'setimmediate';
let numThreads;

if (process.browser) {
  numThreads = (navigator.hardwareConcurrency > 4) ? 4 : navigator.hardwareConcurrency; 
} 

const eqJoin = function (leftData, rightData, leftJoinKey, rightJoinKey, func) {
  // console.log(leftData, rightData);
  const leftKeyisFunction = (typeof leftJoinKey) === 'function';
  const rightKeyisFunction = (typeof rightJoinKey) === 'function';
  const toFunc = function (value) {
    const startBody = value.indexOf('{') + 1;
    const endBody = value.lastIndexOf('}');
    const startArgs = value.indexOf('(') + 1;
    const endArgs = value.indexOf(')');

    return new Function(
      value.substring(startArgs, endArgs),
      value.substring(startBody, endBody)
    );
  };
  const mapFun = (typeof func === "string") ? toFunc(func) : function (left, right) {
    return {
      left,
      right,
    };
  };
  const leftDataLength = leftData.length;
  const rightDataLength = rightData.length;
  let key;
  let result = [];
  let joinMap = {};
  // construct a lookup table

  for (let i = 0; i < rightDataLength; i++) {
    key = rightKeyisFunction ? rightJoinKey(rightData[i]) : rightData[i][rightJoinKey];
    joinMap[key] = rightData[i];
  }

  // Run map function over each object in the resultset
  for (let j = 0; j < leftDataLength; j++) {
    key = leftKeyisFunction ? leftJoinKey(leftData[j]) : leftData[j][leftJoinKey];
    if (joinMap[key]) {
      result.push(mapFun(leftData[j], joinMap[key] || {}));
    }
  }
  return { resultset: result, leftData, rightData };
};

const dbThreads = task.wrap(eqJoin);

export default class Db {
  @observable store;
  @observable events;
  @observable entityId;

  constructor(data, events) {
    this.init(data, events);
  }

  init(data, events) {
    const self = this;
    if (events) {
      self.setupEvents(events);
    }
    if (data) {
      self.store = mobxstore(data);
    }
  }

  setupEvents(events) {
    const self = this;
    this.events = events;

    this.events.on('db', self.eventHandler.bind(this));
    return true;
  }

  setEntityId(entityId) {
    this.entityId = entityId;
  }

  collectionChange(collection, type, target) {
    console.log(moment().unix(), collection, type, target);
  }

  eventHandler(update) {
    const data = update.payload.data;
    let record;
    let deleted = false;
    let retValue = true;
    if (data.error) {
      if (data.error.name === 'SequelizeUniqueConstraintError') {
        record = this.store(
          data.collection,
          [
            filter((rec) => rec.id === data.prior.id),
            first,
          ]
        );
        this.updateStore(data.collection, record, true, deleted);
        record = this.store(
          data.collection,
          [
            filter((rec) => rec.id === data.record.id),
            first,
          ]
        );

        if (record) {
          deleted = (data.type === 'delete') ? true : false;
          record = Object.assign({}, record, data.record);
          retValue = this.updateStore(data.collection, record, true, deleted);
        } else if (data.type !== 'delete') {
          retValue = this.insertDocument(data.collection, data.record);
        }
      }
    } else if (data.type === 'insert' || data.type === 'update' || data.type === 'delete') {
      record = this.store(
        data.collection,
        [
          filter((rec) => rec.id === data.record.id),
          first,
        ]
      );
      if (record) {
        deleted = (data.type === 'delete') ? true : false;
        record = Object.assign({}, record, data.record);
        retValue = this.updateStore(data.collection, record, true, deleted);
      } else if (data.type !== 'delete') {
        retValue = this.insertDocument(data.collection, data.record);
      }
    } else {
      retValue = false;
    }
    return retValue;
  }

  updateCollectionFields(collection, id, updates) {
    let retValue = true;
    let record = this.store(
      collection,
      [
        filter((rec) => rec.id === id),
        first,
      ]
    );
    if (record) {
      record = Object.assign({}, record, updates);
      retValue = this.updateStore(collection, record, false);
    }

    return retValue;
  }

  eqJoin(left, right, leftKey, rightKey, select) {
    return dbThreads(
      left,
      right,
      leftKey,
      rightKey,
      select.toString(),
    );
    /*
    return new Promise(function(resolve, reject){
      let m = primary.length,
          n = foreign.length,
          index = [],
          c = [];
      waterfall(
        [
          function (callback) {
            Promise.each(
              primary,
              function (item) {  // loop through m items
                index[item[primaryKey]] = item;
                return item; // create an index for primary table
              }
            ).then(
              function () {
                callback();
              }
            );
          },
          function (callback) {
            Promise.each(
              foreign,
              function (item) {  // loop through m items
                if (index[item[foreignKey]]) {
                  c.push(select(index[item[foreignKey]], item));
                }
                return item; // create an index for primary table
              }
            ).then(
              function () {
                callback();
              }
            );
          },
        ],
        function (error, results) {
          console.log('eqJoin', c);
          resolve(c);
        }
      );
    });
    */
  }

  @action deleteRecord(collection, id) {
    const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
    const record = this.store(
          collection,
          [
            filter((x) => x.id === id),
            first,
          ]
        );
    if (record) {
      record.deletedAt = ts;
      return this.updateStore(collection, record, false, true);
    } else {
      return null;
    }
  }

  @action updateStore(collection, record, remote, deleted) {
    console.log('updateStore', moment().unix());
    deleted = deleted || false;
    remote = remote || false;
    const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
    const self = this;
    let results, type = 'insert';
    if (record) {
      if (record.id) {
        console.log('updateStore:pre-update', moment().unix());
        type = (deleted) ? 'delete' : 'update';
        record.updatedAt = ts;
        if (deleted) {
          results = record;
        } else {
          results = this.store(
            collection,
            [
              filter((rec) => rec.id === record.id),
            ]
          );
          Object.assign(results[0], record);
          console.log('updateStore:updated', moment().unix());
        }
        if (!remote) this.sendRemote(record, type, collection);
      } else {
        record.createdAt = ts;
        record.updatedAt = ts;
        record.deletedAt = null;
        console.log('updateStore:pre-guid', moment().unix());
        record.id = iouuid.generate().toLowerCase();
        record.entityId = this.entityId;
        console.log('updateStore:guid', moment().unix());
        console.log('updateStore:pre-insert', moment().unix());

        this.store(collection).push(record);
        console.log('updateStore:inserted', moment().unix());
        if (!remote) this.sendRemote(record, type, collection);
      }
    }
    return record;
  }

  @action insertDocument(collection, record) {
    const self = this;
    return self.store(collection).push(record);
  }

  @action sendRemote(record, type, collection) {
    type = type || 'insert';
    const self = this;
    console.log('sendRemote:emit', moment().unix());
    self.events.emit(
      'socket',
      {
        type,
        collection,
        record: toJS(record),
        entityId: this.entityId,
      }
    );
    
  };

}
