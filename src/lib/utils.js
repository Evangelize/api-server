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
    api
    .attendance
    .latest()
    .then(
      function(results) {
        pubClient.publish("congregate:last8attendanceupdate", JSON.stringify(results));
      },
      function(err) {
        console.log(err);
      }
    );
  }
}
