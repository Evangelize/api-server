import redis from 'redis';
import Promise from 'bluebird';
import settings from '../../config';
export default {
  createClient(cb) {
    return new Promise((resolve, reject) => {
      let client;
      client = redis.createClient(
        settings.redis.port,
        settings.redis.host
      );
      if (settings.redis.db >= 0) {
        client.select(
          settings.redis.db,
          () => {
            resolve(client);
          }
        );
      } else {
        resolve(client);
      }
    });
  }
}
