import { extendObservable, observable, autorun, isObservable, isObservableMap, map } from "mobx";
import _ from 'lodash';
import loki from 'lokijs';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';

export default class Db {
  db;
  ws;
  collections = {};
  @observable isUpdating = false;
  
  constructor(data, websocket) {
    this.isUpdating = true;
    this.db = new loki('evangelize');
    let self = this;
    if (websocket) {
      this.setupWs(websocket);
    }
    let indices = {
      divisionClasses: ['classId', 'divisionId', 'deletedAt'],
      divisionClassTeachers: ['divisionClassId', 'day', 'deletedAt'],
      divisionClassAttendance: ['divisionClassId', 'day', 'attendanceDate', 'deletedAt'],
      divisionYears: ['divisionConfigId', 'startDate', 'endDate' ,'deletedAt'],
      divisions:  ['divisionConfigId', 'divisionYear', 'start', 'end', ' deletedAt'],
    };
    Object.keys(data).map(function(key) {
      //console.log("collection", key, data[key]);
      let index = (key in indices) ? indices[key] : [];
      let coll = self.db.addCollection(
        key,
        {
          asyncListeners: true, 
          disableChangesApi: true, 
          clone: false,
          unique: ['id'],
          indices: index
        }
      );
      self.collections[key] = coll;
      extendObservable(self.collections[key], {data: coll.data})
      if (data[key].length) {
        if ("$loki" in data[key][0]) {
          coll.update(data[key]);
        } else {
          coll.insert(data[key]);
        }
      }
      self.collections[key].setChangesApi(true);
      //data[coll.name] = coll.data;
      //coll.on('update', ((...args)=>self.collectionChange(coll.name, 'update', ...args)));
      //coll.on('insert', ((...args)=>self.collectionChange(coll.name, 'insert', ...args)));
    });
    //extendObservable(this, {data: data});
    this.isUpdating = false;
  }
  
  setupWs(websocket) {
    let self = this;
    this.ws = websocket;

    this.ws.on('changes', data => {
      //console.log('changes', data);
      self.wsHandler(self.ws, data);
    });
  }

  collectionChange(collection, type, target) {
    //console.log(collection, type, target);
  }

  wsHandler(ws, update) {
    let data = update.payload.data,
        record;
    //console.log("websocket:", ws);
    //console.log("websocket update:", update);
    if (data.error) {
      if (data.error.name === 'SequelizeUniqueConstraintError') {
        record = this.collections[data.collection]
                .findOne(
                  {
                    $and: [
                      {
                        id: data.prior.id
                      }
                    ]
                  }
                );
        this.updateCollection(data.collection, record, true, deleted);
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
    } else if (data.type === "insert" || data.type === "update" || data.type === "delete") {
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

  updateCollectionFields(collection, id, updates) {
    let record = this.collections[collection]
                .findOne(
                  {
                    $and: [
                      {
                        id: id
                      },
                      {
                        deletedAt: null
                      }
                    ]
                  }
                );
    if (record) {
      record = Object.assign({}, record, updates);
      this.updateCollection(collection, record, false);
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

}
