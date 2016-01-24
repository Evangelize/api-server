import Promise from 'bluebird';
import async from 'async';
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
            .teachers
            .divisionClassTeachers()
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
  }
}
