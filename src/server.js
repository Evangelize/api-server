/* eslint-disable no-console */
const env = process.env.NODE_ENV || 'development';

import fs from 'fs';
import path from 'path';
import async from 'async';
import etag from 'etag';
import Cron from 'cron';
import mobxstore from 'mobx-store';
import * as admin from 'firebase-admin';


// Hapi server imports
import Hapi from 'hapi';
import Inert from 'inert';
import h2o2 from 'h2o2';
import hapiRouter from 'hapi-router';
import AuthBearer from 'hapi-auth-bearer-token';
import cookieJwt from 'hapi-auth-cookie-jwt';

// React imports
import React from 'react';
import ReactDOM from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { Provider } from 'mobx-react';

// React-router routes and history imports
import Db from '../src/stores/db';
import Stores from './stores';
import createRoutes from '../src/routes';
import api from '../src/lib/server';
import utils from '../src/lib/utils';
import parseCookies from '../src/lib/parseCookies';
import createLocation from 'history/lib/createLocation';
import { createClient } from './lib/redisClient';
import { NotAuthorizedException, RedirectException } from './lib/errors';
import settings from '../config/';

let subClient;
let cert;
const CronJob = Cron.CronJob;
const getToken = (headers) => {
  let parts;
  let jwt = null;
  const authorization = headers.authorization;
  const cookie = parseCookies(headers, 'accessToken');
  const userId = parseCookies(headers, 'evangelize-user-id');
  if (authorization) {
    parts = authorization.split(/\s+/);
  }
  if (cookie) {
    jwt = cookie;
  } else if (parts) {
    jwt = parts[1];
  }

  return jwt;
}
const pushResults = function (message, result) {
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
const setSubscription = function () {
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
const ping = function () {
  subClient.ping((err, res) => {
    console.log('redis server pinged');
  });
};
const startPing = function () {
  new CronJob(
    '05 * * * * *',
    () => {
      ping();
    },
    null,
    true,
    'America/Chicago'
  );
};

createClient().then(
  (client) => {
    subClient = client;
    startPing();
    setSubscription();
  }
);

// Start server function
export default function (HOST, PORT, callback) {
  const plugins = [
    {
      register: Inert,
    },
    {
      register: h2o2,
    },
    {
      register: cookieJwt,
    },
    {
      register: AuthBearer,
    },
  ];
  // console.log("jwtCert", settings.get("jwtCert"));
  cert = fs.readFileSync(settings.tokenKey.public);
  utils.setCert(cert);
  // console.log("mysql", settings.get("mysql"));
  const server = new Hapi.Server();
  server.connection(
    {
      host: settings.host || HOST,
      port: settings.port || PORT,
    }
  );
  const serviceAccount = settings.firebase.key;
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: settings.firebase.databaseUri,
    });
  }

  if (env === 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('../webpack/dev.config');
    const WebpackPlugin = require('hapi-webpack-plugin');
    const compiler = webpack(webpackConfig);
    const assets = {
      // webpack-dev-middleware options
      // See https://github.com/webpack/webpack-dev-middleware
      publicPath: '/hot',
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
      },
    };
    const hot = {
      // webpack-hot-middleware options
      // See https://github.com/glenjamin/webpack-hot-middleware
      timeout: '20000',
      reload: false,
    };
    plugins.push({
      register: WebpackPlugin,
      options: { compiler, assets, hot },
    });
  }
  // Register Hapi plugins
  server.register(
    plugins,
    (error) => {
      if (error) {
        return console.error(error);
      }
      server.auth.strategy(
        'authBearer',
        'bearer-access-token',
        false,
        {
          validateFunc: utils.validateJwt,
        }
      );
      server.auth.strategy(
        'accessToken',
        'jwt-cookie',
        false,
        {
          key: cert,
          validateFunc: utils.validateJwt,
        }
      );

      server.register(
        {
          register: hapiRouter,
          options: {
            routes: 'routes/**/*.js', // uses glob to include files
          },
        },
        (error1) => {
          if (error1) {
            return console.error(error1);
          }
          /**
          * Attempt to serve static requests from the public folder.
          */

          server.ext('onPreResponse', (request, reply) => {
            const cookie = getToken(request.headers);
            const location = createLocation(request.path);
            const stores = new Stores();
            // headers are lowercase no matter what
            const entityId = request.headers['x-entity-id'] || null;
            let authenticated = false;
            const retFunc = function (data, payload) {
              const newData = Object.assign({}, data);
              const finalDb = JSON.stringify(newData);
              const store = mobxstore(newData);
              const finalMobx = JSON.stringify(store.object);
              const db = new Db();
              let routes;
              let context;
              console.log('init db');
              db.init(data);
              process.nextTick(() => {
                stores.init(db, null).then(
                  () => {
                    const firebase = (payload && payload.firebase) ? payload.firebase : null;
                    const person = (payload && payload.person) ? payload.person : null;
                    stores.stores.auth.authenticated = (firebase) ? true : false;
                    stores.stores.auth.user = {
                      firebase,
                      db: person,
                    };
                    routes = createRoutes(stores.stores.auth);
                    context = Object.assign(
                      {
                        db,
                        sockets: null,
                      },
                      stores.stores
                    );
                    match({ routes, location }, (err, redirectLocation, renderProps) => {
                      if (err || !renderProps) {
                        // reply("500: " + error.message)
                        reply.continue();
                      } else if (redirectLocation) {
                        reply.redirect(redirectLocation.pathname + redirectLocation.search);
                      } else if (renderProps) {
                        console.log('ReactDOM: begin render to string');
                        const reactString = ReactDOM.renderToString(
                          <Provider {...context}><RouterContext {...renderProps} /></Provider>
                        );
                        console.log('ReactDOM: end render to string');
                        const script = process.env.NODE_ENV === 'production' ? '/dist/client.min.js' : '/hot/client.js';
                        const websocketUri = `//${settings.websocket.host}:${settings.websocket.port}`;
                        const output = (
                          `<!doctype html>
                          <html lang="en-us">
                            <head>
                              <script>
                                var wsUri = '${websocketUri}';
                                var dbJson = ${finalDb};
                                var mobxStore = ${finalMobx};
                                var entityId = '${entityId}';
                                var user = '${JSON.stringify({ payload })}';
                              </script>
                              <meta charset="utf-8">
                              <meta name="viewport" content="width=device-width, minimum-scale=1.0">
                              <title>Evangelize</title>
                              <link rel="stylesheet" href="/css/sanitize.css" />
                              <link rel="stylesheet" href="/css/typography.css" />
                              <link rel="stylesheet" href="/chartist/css/chartist.min.css">
                              <link rel="shortcut icon" sizes="16x16 32x32 48x48 64x64 128x128 256x256" href="/favicon.ico">
                              <link href="//fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
                              <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
                              <link rel="stylesheet" href="/css/custom.css" />
                            </head>
                            <body>
                              <div id="root"><div>${reactString}</div></div>
                              <script async=async src=${script}></script>
                            </body>
                          </html>`
                        );
                        const eTag = etag(output);
                        reply(output).header('cache-control', 'max-age=0, private, must-revalidate').header('etag', eTag);
                      }
                    });
                  }
                );
              });
            };
            const processRequest = (payload) => {
              const newPerson = payload || null;
              try {
                if (typeof request.response.statusCode !== 'undefined') {
                  return reply.continue();
                }

                if (!authenticated && (request.path !== '/login' && request.path.indexOf('/api/auth') === -1)) {
                  console.log(request.headers);
                  throw new NotAuthorizedException('/login');
                } else if (authenticated && request.path === '/login') {
                  console.log('error authenticated already');
                  throw new RedirectException('/dashboard');
                }

                console.log('Create Window Object');
                if (typeof window === 'undefined'){
                  global.window = Object();
                }

                const { headers } = request;

                global.navigator = {
                  userAgent: headers['user-agent'],
                };

                utils
                .getAllTables()
                .then(
                  (results) => {
                    console.log('got all tables');
                    retFunc(results, newPerson);
                  },
                  (err) => {
                    console.log('error getting all tables', err);
                    retFunc(null, newPerson);
                  }
                );
              } catch (err) {
                if (err instanceof NotAuthorizedException) {
                  console.log('redirect to login');
                  console.error(err);
                  reply.redirect('/login');
                } else if (err instanceof RedirectException) {
                  console.log('redirect to dashboard');
                  reply.redirect('/dashboard');
                }
              }
              return true;
            };
            if (cookie) {
              // console.log("cookie", cookie);
              utils.validateJwt(
                cookie,
                (errors, authorized, credentials) => {
                  if (authorized) {
                    authenticated = true;
                    processRequest(credentials);
                  } else {
                    processRequest();
                  }
                }
              );
            } else {
              processRequest();
            }
          });
          return true;
        }
      );
    }
  );
  // Start Development Server
  return server.start(() => callback(server));
}

process.on('uncaughtException', (err) => {
  const date = new Date();
  console.error(`${date.toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});