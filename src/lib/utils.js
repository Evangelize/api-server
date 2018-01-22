import Promise from 'bluebird';
import async from 'async';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { getUser } from './firebase-admin';
import settings from '../../config';
import { createClient } from './redisClient';
import api from './server';
let pubClient;
let jwtCert;

createClient().then(
  (client) => {
    pubClient = client;
  }
);

export default {
  setCert(cert) {
    jwtCert = cert;
  },
  pushLast8Attenance() {
    return api
    .attendance
    .latest()
    .then(
      (results) => {
        pubClient.publish('evangelize:attendance.UPDATE_LATEST_ATTENDANCE_FULFILLED', JSON.stringify(results));
        return results;
      },
      (err) => {
        console.log(err);
        return err;
      }
    );
  },
  pushAvgAttendance() {
    return api
    .attendance
    .average()
    .then(
      (results) => {
        pubClient.publish('evangelize:attendance.UPDATE_AVG_ATTENDANCE_FULFILLED', JSON.stringify(results));
        return results;
      },
      (err) => {
        console.log(err);
        return err;
      }
    );
  },
  pushMessage(channel, message) {
    pubClient.publish(`evangelize:${channel}`, JSON.stringify(message));
    return null;
  },
  getPeoplePassword(email) {
    return new Promise((resolve, reject) => {
      api
      .people
      .find(
        'emailAddress',
        email
      )
      .then(
        (people) => {
          if (people.length){
            api
            .users
            .get(people[0].id)
            .then(
              (results) => {
                const payload = {
                  person: people[0].toJSON(),
                  user: results.toJSON(),
                };
                resolve(payload);
                return null;
              },
              (err) => {
                reject(err);
                return null;
              }
            );
          } else {
            resolve(null);
            return null;
          }
        },
        (err) => {
          reject(err);
          return null;
        }
      );
    });
  },
  getAllTables(entityId, lastUpdate) {
    const update = (lastUpdate) ? moment(lastUpdate, 'X').format('YYYY-MM-DD HH:mm:ss') : lastUpdate;
    const bEntityId = (entityId) ? new Buffer(entityId, 'hex') : null;
    const exclude = [
      'thirdPartyLogins',
      'errors',
    ];
    const keys = Object.keys(api).filter(k => !exclude.includes(k));
    const getTable = async (key) => {
      const table = await api[key].all(bEntityId, update);
      const values = table.map(t => t.get());
      return {
        key,
        values,
      };
    };
    return Promise.map(keys, getTable).then(
      (values) => {
        const retVal = values.reduce(
          (m, v) => {
            m[v.key] = v.values;
            return m;
          },
          {}
        );
        return retVal;
      }
    ).catch(e => e);
  },
  validateJwt(token, callback) {
    const payload = {
      decoded: null,
      person: null,
      firebase: null,
    };

    console.log('validateJwt');
    jwt.verify(
      token,
      jwtCert,
      {
        algorithm: 'RS256',
      },
      (err, decoded) => {
        console.log('jwt', decoded);
        payload.decoded = decoded;
        if (err) {
          console.log(decoded);
          return callback(err, false, decoded);
        }
        const uid = decoded.uid;
        getUser(uid)
        .then(
          (firebase) => {
            if (firebase) {
              payload.firebase = firebase;
            }
            return api.people.get(decoded.peopleId);
          }
        )
        .then(
          (results) => {
            if (results) {
              payload.person = results.toJSON(); 
            }

            return callback(null, true, payload);
          },
        )
        .catch((error) => callback(error, false, null));
      }
    );
  },
}
