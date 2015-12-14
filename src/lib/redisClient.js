import redis from 'redis';
import path from 'path';
import nconf from 'nconf';
import Promise from 'bluebird';
const config = nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../../config/settings.json') });

export default {
  createClient(cb) {
    return new Promise(function(resolve, reject){
      let client;
      client = redis.createClient(
        config.get("redis:port"),
        config.get("redis:host")
      );
      if (config.get("redis:db") >= 0) {
        client.select(
          config.get("redis:db"),
          function() {
            resolve(client);
          }
        );
      } else {
        resolve(client);
      }
    });
  }
}
