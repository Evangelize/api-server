import Promise from 'bluebird';
import async from 'async';
import jwt from 'jsonwebtoken';
import { createClient } from './redisClient';
import api from './server';
let pubClient;

createClient().then(
  (client) => {
    pubClient = client;
  }
);

export default {
  pushLast8Attenance() {
    return api
    .attendance
    .latest()
    .then(
      (results) => {
        pubClient.publish('congregate:attendance.UPDATE_LATEST_ATTENDANCE_FULFILLED', JSON.stringify(results));
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
        pubClient.publish('congregate:attendance.UPDATE_AVG_ATTENDANCE_FULFILLED', JSON.stringify(results));
        return results;
      },
      (err) => {
        console.log(err);
        return err;
      }
    );
  },
  pushMessage(channel, message) {
    pubClient.publish(`congregate: ${channel}`, JSON.stringify(message));
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
                  user: results.toJSON()
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
  getAllTables() {
    return new Promise((resolve, reject) => {
      let retVal = {};
      async.each(
        Object.keys(api), 
        (prop, callback) => {
          console.log('Get table:', prop);
          api[prop].all()
          .then(
            (items) => {
              async.map(
                items,
                (item, cb) => {
                  cb(null, item.get({ plain: true }));
                },
                (err, result) => {
                  retVal[prop] = result;
                  callback(null);
                }
              );
            },
            (err) => {
              callback(err);
            }
          );
        },
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(retVal);
          }
          return null;
        }
      );
    });
  },
  validateJwt(token, cert) {
    return new Promise((resolve, reject) => {
      console.log('validateJwt');
      jwt.verify(
        token,
        cert,
        {
          algorithm: 'RS256'
        },
        (err, decoded) => {
          console.log('jwt', decoded);
          if (err) {
            console.log(decoded);
            reject(err);
          }
          api
          .people
          .get(decoded.peopleId)
          .then(
            (results) => {
              if (results) {
                resolve(results.toJSON());
              } else {
                resolve(null);
              }
              return null;
            },
            (err) => {
              reject(err);
              return null;
            }
          );
        }
      );
    });
  }
}
