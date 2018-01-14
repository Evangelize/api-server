/* eslint-disable no-console */
const env = process.env.NODE_ENV || 'development';

import fs from 'fs';
import path from 'path';
import async from 'async';
import etag from 'etag';
import Cron from 'cron';
import chalk from 'chalk';

// Hapi server imports
import Hapi from 'hapi';
import inert from 'inert';
import hapiRouter from 'hapi-router';
import AuthBearer from 'hapi-auth-bearer-token';
import HapiLogRequests from 'hapi-log-requests';
import hapiError from 'hapi-error';
import vision from 'vision';

// React-router routes and history imports
import api from './lib/server';
import utils from './lib/utils';
import { createClient } from './lib/redisClient';
import settings from '../config/';

const logger = console;
const CronJob = Cron.CronJob;
const pushResults = (message, result) => {
  console.log('pushResults', message, result);
  const update = {
    type: message.type,
    collection: message.collection,
    prior: message.target,
    record: result,
    error: result.error,
  };
  utils.pushMessage(`changes.${message.type}`, update);
};

const setSubscription = (subClient) => {
  subClient.psubscribe('evangelize:*');
  // console.log("Subscribing");
  subClient.on('pmessage', (pattern, channel, message) => {
    const subChannel = channel.split(':')[1];
    console.log('channel ', channel, ': ', message);
    if (subChannel === 'insert' || subChannel === 'update' || subChannel === 'delete'){
      message = JSON.parse(message);
      const entityId = message.record.entityId;
      const record = message.record;
      console.log('pmessage', message);
      switch (message.type) {
      case 'insert':
        api[message.collection].insert(record)
        .then(
          (results) => {
            results.error = false;
            results.entityId = entityId;
            pushResults(message, results);
          },
          (err) => {
            pushResults(message, err);
          }
        );
        break;
      case 'update':
        api[message.collection].update(record)
        .then(
          (results) => {
            results.error = false;
            results.entityId = entityId;
            pushResults(message, results);
          },
          (err) => {
            pushResults(message, err);
          }
        );
        break;
      case 'delete':
        api[message.collection].delete(record)
        .then(
          (results) => {
            results.error = false;
            results.entityId = entityId;
            pushResults(message, results);
          },
          (err) => {
            pushResults(message, err);
          }
        );
        break;
      default:
        break;
      }
    }
  });
};

const ping = (subClient) => {
  subClient.ping((err, res) => {
    console.log('redis server pinged');
  });
};

const startPing = (subClient) => {
  return new CronJob(
    '05 * * * * *',
    () => {
      ping(subClient);
    },
    null,
    true,
    'America/Chicago'
  );
};

const server = Hapi.server({
  port: settings.port,
  routes: {
    cors: {
      origin: 'ignore',
    },
  }, 
});

const start = async () => {

  const subClient = await createClient();
  startPing(subClient);
  setSubscription(subClient);
  const cert = fs.readFileSync(settings.tokenKey.public);
  utils.setCert(cert);

  // await server.register(hapiError);
  await server.register(HapiLogRequests(logger));
  await server.register(vision);
  await server.register(AuthBearer);
  await server.register(inert);
  try {
    await server.register(
      {
        plugin: hapiRouter,
        options: {
          routes: 'routes/**/*.js', // uses glob to include files
        },
      }
    );
  } catch (e) {
    console.log(e);
    throw e;
  }

  server.auth.strategy(
    'simple',
    'bearer-access-token',
    {
      allowQueryToken: true, // optional, false by default
      validate: async (req, token, h) => {
        // here is where you validate your token
        // comparing with token from your database for example
        console.log(req);
        const paths = [
          '/api/auth/thirdPartyLogin',
        ];
        let isValid = false;
        const credentials = { token };
        const artifacts = { user: null };
        if (paths.includes(req.path)) {
          isValid = true;
        } else {
          const results = await api.thirdPartyLogins.get('google', token);
          if (results) {
            artifacts.user = results[0];
            isValid = true;
          }
        }
        return { isValid, credentials, artifacts };
      },
    },
  );

  server.auth.default('simple');

  server.views({
    engines: {
      html: require('handlebars'),
    },
    path: path.resolve(__dirname, './templates'),
  });

  await server.start();
  return server;
};

start()
.then(
  (srv) => {
    console.info(
      chalk.bold.green(`==> Hapi ${env} server is listening on ${srv.info.uri}`)
    );
  }
)
.catch(
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

process.on('uncaughtException', (err) => {
  const date = new Date();
  console.error(`${date.toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});