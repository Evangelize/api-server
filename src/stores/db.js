import { extendObservable, observable, autorun, isObservable, isObservableMap, map, action, runInAction } from "mobx";
import { filter, pick, sortBy, first, take, remove } from 'lodash/fp';
import each from 'async/each';
import waterfall from 'async/waterfall';
import mobxstore from 'mobx-store';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';
import Promise from 'bluebird';

export default class Db {
  store;
  ws;
  collections = {};
  @observable isUpdating = false;
  
  constructor() {
    this.isUpdating = true;
    let self = this;
  }

  init(data, websocket) {
    let self = this;
    return new Promise(function(resolve, reject){
      if (websocket) {
        self.setupWs(websocket);
      }
      if (data) {
        self.store = mobxstore(data);
      }
      resolve(true);
    });
  }
  
  async setupWs(websocket) {
    let self = this;
    this.ws = websocket;

    this.ws.on('changes', data => {
      //console.log('changes', data);
      self.wsHandler(self.ws, data);
    });
    this.ws.emitAsync = Promise.promisify(this.ws.emit);
    return true;
  }

  collectionChange(collection, type, target) {
    console.log(moment().unix(), collection, type, target);
  }

  async wsHandler(ws, update) {
    let data = update.payload.data,
        record, storeRecord;
    //console.log("websocket:", ws);
    //console.log("websocket update:", update);
    console.log("wsHandler", moment().unix());
    if (data.error) {
      if (data.error.name === 'SequelizeUniqueConstraintError') {
        record = await this.store(
          data.collection, 
          [
            filter((x) => x.id === data.prior.id),
            first
          ]
        );
        this.updateStore(data.collection, record, true, deleted);
        record = await this.store(
          data.collection, 
          [
            filter((x) => x.id === data.record.id),
            first
          ]
        );
        
        if (record) {
          let deleted = (data.type === "delete") ? true : false;
          record = Object.assign({}, record, data.record);
          return await this.updateStore(data.collection, record, true, deleted);
        } else if (data.type !== "delete") {
          return await this.insertDocument(data.collection, data.record);
        }
      }
    } else if (data.type === "insert" || data.type === "update" || data.type === "delete") {
      record = this.store(
        data.collection, 
        [
          filter((x) => x.id === data.record.id),
          first
        ]
      );
      if (record) {
        let deleted = (data.type === "delete") ? true : false;
        record = Object.assign({}, record, data.record);
        return await this.updateStore(data.collection, record, true, deleted);
      } else if (data.type !== "delete") {
        return await this.insertDocument(data.collection, data.record);
      }

    } else {
      return false;
    }
  }

  updateCollectionFields(collection, id, updates) {
    let record = this.store(
          collection, 
          [
            filter((x) => x.id === data.record.id),
            first
          ]
        );
    if (record) {
      record = Object.assign({}, record, updates);
      return this.updateCollection(collection, record, false);
    }
  }

  eqJoin(primary, foreign, primaryKey, foreignKey, select) {
    return new Promise(function(resolve, reject){
      let m = primary.length, 
          n = foreign.length, 
          index = [], 
          c = [];
      waterfall(
        [
          function(callback) {
            each(
              primary,
              function(item, cback) {  // loop through m items
                index[item[primaryKey]] = item; // create an index for primary table
                cback();
              },
              function(err) {
                callback();
              }
            );
          },
          function(callback) {
            each(
              foreign,
              function(item, cback) {  // loop through n items
                // get corresponding row from primary
                // select only the columns you need
                if (index[item[foreignKey]]) {
                  c.push(select(index[item[foreignKey]], item));    
                }
                cback();
              },
              function(err) {
                callback();
              }
            );
          }
        ],
        function(error, results) {
          console.log("eqJoin", c);
          resolve(c);
        }
      );
      
    });
  }

  @action async deleteRecord(collection, id) {
    const ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    let record = await this.store(
          collection, 
          [
            filter((x) => x.id === id),
            first
          ]
        );
    if (record) {
      record = Object.assign({}, record, {deletedAt: ts});
      return await this.updateStore(collection, record, false, true);
    } else {
      return null;
    }
  }

  @action async updateCollection(collection, record, remote, deleted) {
    console.log("updateCollection", moment().unix());
    deleted = deleted || false;
    remote = remote || false;
    const ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    let results, type = 'insert',
        self = this;
    const sendRemote = function(record) {
      return new Promise(function(resolve, reject){
        if (!remote) {
          console.log("updateCollection:emit", moment().unix());
          self.ws.emitAsync(
            type,
            {
              type: type,
              collection: collection,
              target: record
            }
          ).then(
            function(data) {
              resolve(data);
            }
          );
        } else {
          resolve(true);
        }
      });
    };
    if (record) {
      if (record.id) {
        console.log("updateCollection:pre-update", moment().unix());
        type = (deleted) ? 'delete' : 'update';
        record.updatedAt = ts;
        if (deleted) {
          this.collections[collection].remove(record);
          console.log("updateCollection:removed", moment().unix());
          results = record;
        } else {
          results = await this.collections[collection].update(record);
          console.log("updateCollection:updated", moment().unix());
        }
        sendRemote(record);
      } else {
        
        record.createdAt = ts;
        record.updatedAt = ts;
        console.log("updateCollection:pre-guid", moment().unix());
        record.id = iouuid.generate().toLowerCase();
        console.log("updateCollection:guid", moment().unix());
        console.log("updateCollection:pre-insert", moment().unix());
        results = this.insertDocument(collection, record).then(
          function(data) {
            console.log("updateCollection:inserted", moment().unix());
            sendRemote(record);
          }
        );
        
      }
    }
  }

  @action updateStore(collection, record, remote, deleted) {
    console.log("updateCollection", moment().unix());
    deleted = deleted || false;
    remote = remote || false;
    const ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    let results, type = 'insert',
        self = this;
    const sendRemote = function(record) {
      return new Promise(function(resolve, reject){
        if (!remote) {
          console.log("updateCollection:emit", moment().unix());
          self.ws.emitAsync(
            type,
            {
              type: type,
              collection: collection,
              target: record
            }
          ).then(
            function(data) {
              resolve(data);
            }
          );
        } else {
          resolve(true);
        }
      });
    };
    if (record) {
      if (record.id) {
        console.log("updateCollection:pre-update", moment().unix());
        type = (deleted) ? 'delete' : 'update';
        record.updatedAt = ts;
        if (deleted) {
          this.store(
            collection, 
            [
              remove((n) => n.id === record.id)
            ]
          );
          console.log("updateCollection:removed", moment().unix());
          results = record;
        } else {
          results = this.store(
            collection, 
            [
              filter((n) => n.id === record.id)
            ]
          );
          Object.assign(results[0], record);
          console.log("updateCollection:updated", moment().unix());
        }
        sendRemote(record);
      } else {
        
        record.createdAt = ts;
        record.updatedAt = ts;
        console.log("updateCollection:pre-guid", moment().unix());
        record.id = iouuid.generate().toLowerCase();
        console.log("updateCollection:guid", moment().unix());
        console.log("updateCollection:pre-insert", moment().unix());

        this.store(collection).push(record);
        console.log("updateCollection:inserted", moment().unix());
        sendRemote(record);
      }
    }
  }

  @action insertDocument(collection, record) {
    let self = this;
    return new Promise(function(resolve, reject){
      let result = self.store(collection).push(record);
      resolve(result);
    });
  }

}
