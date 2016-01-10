import Promise from 'bluebird';
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
  }
}
