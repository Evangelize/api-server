import Promise from 'bluebird';
import async from 'async';
import jwt from 'jsonwebtoken';
import {createClient} from './redisClient';
import api from './server';
let pubClient;

createClient().then(
  function(client) {
    pubClient = client;
  }
);

export default {
  pushLast8Attenance() {
    return api
    .attendance
    .latest()
    .then(
      function(results) {
        pubClient.publish("congregate:attendance.UPDATE_LATEST_ATTENDANCE_FULFILLED", JSON.stringify(results));
        return results;
      },
      function(err) {
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
      function(results) {
        pubClient.publish("congregate:attendance.UPDATE_AVG_ATTENDANCE_FULFILLED", JSON.stringify(results));
        return results;
      },
      function(err) {
        console.log(err);
        return err;
      }
    );
  },
  pushMessage(channel, message) {
    pubClient.publish("congregate:"+channel, JSON.stringify(message));
    return null;
  },
  getPeoplePassword(email) {
    return new Promise(function(resolve, reject){
       api
        .people
        .find(
          "emailAddress",
          email
        )
        .then(
          function(people) {
            if (people.length){
              api
              .users
              .get(people[0].id)
              .then(
                function(results) {
                  let payload = {
                    person: people[0].toJSON(),
                    user: results.toJSON()
                  };
                  resolve(payload);
                  return null;
                },
                function(err) {
                  reject(err);
                  return null;
                }
              );
            } else {
              resolve(null);
              return null;
            }
          },
          function(err) {
            reject(err);
            return null;
          }
        );
    });
  },
  getAllTables() {
    return new Promise(function(resolve, reject){
      async.parallel(
        {
          divisionConfigs: function(callback){
            api
            .divisions
            .divisionConfigs()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          families: function(callback){
            api
            .families
            .get()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          divisions: function(callback){
            api
            .divisions
            .divisions()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          divisionYears: function(callback){
            api
            .divisions
            .divisionYears()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          classes: function(callback){
            api
            .classes
            .classes()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          divisionClasses: function(callback){
            api
            .classes
            .divisionClasses()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          divisionClassTeachers: function(callback){
            api
            .divisionClassTeachers
            .get()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          yearMeetingDays: (callback) => {
            api
            .yearMeetingDays
            .all()
            .then(
              (results) => {
                async.map(
                  results,
                  (item, cb) => {
                    cb(null, item.get({ plain: true }))
                  },
                  (err, result) => {
                    callback(null, result);
                  }
                );
              },
              (err) => {
                console.log(err);
                callback(err);
              }
            );
          },
          yearClassStudents: (callback) => {
            api
            .yearClassStudents
            .all()
            .then(
              (results) => {
                async.map(
                  results,
                  (item, cb) => {
                    cb(null, item.get({ plain: true }))
                  },
                  (err, result) => {
                    callback(null, result);
                  }
                );
              },
              (err) => {
                console.log(err);
                callback(err);
              }
            );
          },
          classMeetingDays: function(callback){
            api
            .classes
            .classMeetingDays()
            .then(
              function(items) {
                async.map(
                  items,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                callback(err);
              }
            );
          },
          notes: function(callback){
            api
            .notes
            .notes()
            .then(
              function(results) {
                async.map(
                  results,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                console.log(err);
                callback(err);
              }
            );
          },
          divisionClassAttendance: function(callback){
            api
            .attendance
            .divisionClassAttendance()
            .then(
              function(results) {
                async.map(
                  results,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                console.log(err);
                callback(err);
              }
            );
          },
          people: function(callback){
            api
            .people
            .people()
            .then(
              function(results) {
                async.map(
                  results,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                console.log(err);
                callback(err);
              }
            );
          },
          students: function(callback){
            api
            .students
            .students()
            .then(
              function(results) {
                async.map(
                  results,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                console.log(err);
                callback(err);
              }
            );
          },
          teachers: function(callback){
            api
            .teachers
            .teachers()
            .then(
              function(results) {
                async.map(
                  results,
                  function(item, cb) {
                    cb(null, item.get({ plain: true }))
                  },
                  function(err, result) {
                    callback(null, result);
                  }
                );
              },
              function(err) {
                console.log(err);
                callback(err);
              }
            );
          }
        },
        function(err, results) {
          if (err) {
            console.log(err);
            reject(err);
            return null;
          } else {
            resolve(results);
            return null;
          }
        }
      );
    });
  },
  validateJwt(token, cert) {
    return new Promise(function(resolve, reject){
      console.log("validateJwt");
      jwt.verify(
        token,
        cert,
        {
          algorithm: 'RS256'
        },
        function(err, decoded) {
          console.log('jwt', decoded);
          if (err) {
            console.log(decoded);
            reject(err);
          }
          api
          .people
          .get(decoded.peopleId)
          .then(
            function(results) {
              if (results) {
                resolve(results.toJSON());
              } else {
                resolve(null);
              }
              return null;
            },
            function(err) {
              reject(err);
              return null;
            }
          );
        }
      );
    });
  }
}
