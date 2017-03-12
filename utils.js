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
      (results) => pubClient.publish('evangelize:attendance.UPDATE_LATEST_ATTENDANCE_FULFILLED', JSON.stringify(results)),
      (err) => Promise.reject(err)
    );
  },
  pushAvgAttendance() {
    return api
    .attendance
    .average()
    .then(
      (results) => pubClient.publish('evangelize:attendance.UPDATE_AVG_ATTENDANCE_FULFILLED', JSON.stringify(results)),
      (err) => Promise.reject(err)
    );
  },
  pushMessage(channel, message) {
    return pubClient.publish(`evangelize: ${channel}`, JSON.stringify(message));
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
          if (people.length) {
            api
            .users
            .get(people[0].id)
            .then(
              (results) => {
                const payload = {
                  person: people[0].toJSON(),
                  user: results.toJSON(),
                };
                return resolve(payload);
              },
              (err) => reject(err)
            );
          } else {
            return reject(people);
          }
        },
        (err) => reject(err)
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
            return reject(err);
          } else {
            return resolve(retVal);
          }
        }
      );
    });
  },
  validateJwt(token, cert) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        cert,
        {
          algorithm: 'RS256',
        },
        (err, decoded) => {
          if (err) {
            reject(err);
          }
          api
          .people
          .get(decoded.peopleId)
          .then(
            (results) => {
              if (results) {
                return resolve(results.toJSON());
              } else {
                return reject(results);
              }
            },
            (err) => reject(err)
          );
        }
      );
    });
  },
}
