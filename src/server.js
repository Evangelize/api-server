/* eslint-disable no-console */
const env = process.env.NODE_ENV || 'development';

import fs from 'fs';
import path from 'path';
import async from 'async';
import nconf from 'nconf';
import etag from 'etag';
import Cron from 'cron';
import { toJSON } from 'mobx';
import mobxstore from 'mobx-store';
import { filter, map, pick, sortBy, take } from 'lodash/fp';


// Hapi server imports
import Hapi from 'hapi';
import Inert from 'inert';
import h2o2 from 'h2o2';
import vision from 'vision';
import hapiRouter from 'hapi-router';
import cookieJwt from 'hapi-auth-cookie-jwt';

// React imports
import React from "react";
import ReactDOM from "react-dom/server";
import { RouterContext, match } from 'react-router';
import Provider from './components/Provider';
import reactCookie from 'react-cookie';

// React-router routes and history imports
import Db from '../src/stores/db';
import Classes from '../src/stores/classes';
import Settings from '../src/stores/settings';
import createRoutes from '../src/routes';
import models from '../src/models';
import * as types from '../src/constants';
import api from '../src/lib/server';
import utils from '../src/lib/utils';
import parseCookies from '../src/lib/parseCookies';
import createLocation from 'history/lib/createLocation';
import createHistory from 'history/lib/createMemoryHistory';
import {createClient} from './lib/redisClient';
import { NotAuthorizedException, AccessDeniedException, RedirectException } from './lib/errors';

let subClient,
    cert;
const CronJob = Cron.CronJob,
      pushResults = function(message, result) {
        let update = {
          type: message.type,
          collection: message.collection,
          prior: message.target,
          record: result,
          error: result.error
        }
        utils.pushMessage("changes."+message.type, update);
      },
      setSubscription = function() {
        subClient.psubscribe("congregate:*");
        //console.log("Subscribing");
        subClient.on("pmessage", function (pattern, channel, message) {
          let subChannel = channel.split(":")[1];
          //console.log("channel ", channel, ": ", message);
          if (subChannel === "insert" || subChannel === "update" || subChannel === "delete"){
            message = JSON.parse(message);
            let record =  message.target;
            delete record.meta;
            delete record.$loki;
            switch (message.type) {
              case "insert":
                api[message.collection].insert(record)
                .then(
                  function(results) {
                    results.error = false;
                    pushResults(message, results);
                  },
                  function(err) {
                    pushResults(message, err);
                  }
                );
                break;
              case "update":
                api[message.collection].update(record)
                .then(
                  function(results) {
                    results.error = false;
                    pushResults(message, results);
                  },
                  function(err) {
                    pushResults(message, err);
                  }
                );
                break;
              case "delete":
                api[message.collection].delete(record)
                .then(
                  function(results) {
                    results.error = false;
                    pushResults(message, results);
                  },
                  function(err) {
                    pushResults(message, err);
                  }
                );
                break;
              default:
                break;
            }
          }
        });
      },
      ping = function() {
        subClient.ping(function (err, res) {
          console.log("redis server pinged");
        });
      },
      startPing = function() {
        new CronJob(
          '05 * * * * *',
          function() {
            ping();
          },
          null,
          true,
          'America/Chicago'
        );
      };

createClient().then(
  function(client) {
    subClient = client;
    startPing();
    setSubscription();
  }
);
if (env === 'development') {
  // Webpack imports
  var webpack = require('webpack'),
      WebpackPlugin = require('hapi-webpack-plugin'),
      webpackConfig = require('../webpack/dev.config');
}

// Start server function
export default function( HOST, PORT, callback ) {
  let plugins = [
        {
          register: Inert
        },
        {
          register: hapiRouter,
          options: {
            routes: 'routes/**/*.js' // uses glob to include files
          }
        },
        {
          register: h2o2
        },
        {
          register: cookieJwt
        }
      ],
      settings = nconf.argv()
       .env()
       .file({ file: path.join(__dirname, '../config/settings.json') });
  //console.log("jwtCert", settings.get("jwtCert"));
  cert = fs.readFileSync(settings.get("jwtCert"));
  //console.log("mysql", settings.get("mysql"));
  const server = new Hapi.Server();
  server.connection(
    {
      host: settings.get("host") || HOST,
      port: settings.get("port") || PORT
    }
  );

  if (env === 'development') {
    const compiler = webpack( webpackConfig );
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
        modules: false
      }
    };
    const hot = {
      // webpack-hot-middleware options
      // See https://github.com/glenjamin/webpack-hot-middleware
      timeout: '20000',
      reload: false
    };
    plugins.push({
      register: WebpackPlugin,
      options: { compiler, assets, hot }
    });
  }

  // Register Hapi plugins
  server.register(
    plugins,
    ( error ) => {
    if ( error ) {
      return console.error( error );
    }

    server.auth.strategy('accessToken', 'jwt-cookie', {
      key: cert,
      validateFunc: utils.validateJwt
    });

    /**
    * Attempt to serve static requests from the public folder.
    */

    server.ext( 'onPreResponse', ( request, reply ) => {
      const cookie = parseCookies(request.headers, "accessToken");
      const location = createLocation( request.path );
      let authenticated = false,
          retFunc = function(data, person) {
            const _data = Object.assign({}, data);
            const finalDb = JSON.stringify(_data);
            const store = mobxstore(_data);
            const finalMobx = JSON.stringify(store.object);
            const db = new Db();
            let classes, appSettings, routes, context;
            async.waterfall(
              [
                function(callback) {
                  db.init(data).then(
                    function(data) {
                      callback(null);
                    }
                  );
                },
                function(callback) {
                  classes = new Classes(db);
                  appSettings = new Settings();
                  appSettings.user = {person: person};
                  appSettings.authenticated = authenticated;
                  routes = createRoutes(appSettings);
                  context = {
                    state: {
                      db: db,
                      classes: classes, 
                      settings: appSettings
                    },
                    store: {

                    }
                  };
                  callback(null);
                }
              ],
              function(err, result) {

                match({ routes, location }, ( error, redirectLocation, renderProps ) => {
                  if ( error || !renderProps ) {
                    // reply("500: " + error.message)
                    reply.continue();
                  } else if ( redirectLocation ) {
                    reply.redirect( redirectLocation.pathname + redirectLocation.search );
                  } else if ( renderProps ) {
                    const reactString = ReactDOM.renderToString(
                      <Provider context={context}><RouterContext {...renderProps} /></Provider>
                    );
                    let settings = nconf.argv()
                      .env()
                      .file({ file: path.join(__dirname, '../config/settings.json') });
                    const script = process.env.NODE_ENV === 'production' ? '/dist/client.min.js' : '/hot/client.js',
                          websocketUri = "//"+settings.get("websocket:host")+":"+settings.get("websocket:port");
                    let output = (
                      `<!doctype html>
                      <html lang="en-us">
                        <head>
                          <script>
                            var wsUri = '${websocketUri}',
                                dbJson = ${finalDb},
                                mobxStore = ${finalMobx},
                                user = '${JSON.stringify({person: person})}';
                          </script>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, minimum-scale=1.0">
                          <title>Evangelize</title>
                          <link rel="stylesheet" href="/css/sanitize.css" />
                          <link rel="stylesheet" href="/css/typography.css" />
                          <link rel="stylesheet" href="/chartist/css/chartist.min.css">
                          <link rel="shortcut icon" sizes="16x16 32x32 48x48 64x64 128x128 256x256" href="/favicon.ico?v2">
                          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
                          <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.3.15/slick.css" />
                          <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/medium-editor/5.11.0/css/medium-editor.css" />
                          <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/medium-editor/5.11.0/css/themes/default.css" />
                          <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
                          <link rel="stylesheet" href="/css/custom.css" />
                        </head>
                        <body>
                          <div id="root"><div>${reactString}</div></div>
                          <script async=async src=${script}></script>
                        </body>
                      </html>`
                    );
                    let eTag = etag(output);
                    reply(output).header('cache-control', 'max-age=0, private, must-revalidate').header('etag', eTag);
                  }
                });

              }
            );
            
          },
          processRequest = function(person) {
            person = person || null;
            try {
              if ( typeof request.response.statusCode !== 'undefined' ) {
                return reply.continue();
              }

              if (!authenticated && request.path !== '/login') {
                throw new NotAuthorizedException('/login');
              } else if(authenticated && request.path === '/login') {
                console.log("error authenticated already");
                throw new RedirectException('/dashboard');
              }
              
              console.log("Create Window Object");
              if (typeof(window) == 'undefined'){
                global.window = new Object();
              }

              const {headers} = request;

              global.navigator = {
                userAgent: headers['user-agent']
              };

              utils
              .getAllTables()
              .then(
                function(results) {
                  retFunc(results, person);

                },
                function(err) {
                  console.log(err);
                  retFunc(null, person);
                }
              );
            } catch (err) {
              if (err instanceof NotAuthorizedException) {
                console.log('redirect to login');
                reply.redirect('/login');
              } else if(err instanceof RedirectException) {
                console.log('redirect to dashboard');
                reply.redirect('/dashboard');
              }
            }
          };
      if (cookie) {
        //console.log("cookie", cookie);
        utils.validateJwt(cookie, cert)
        .then(
          function(person) {
            authenticated = true;
            processRequest(person);
          },
          function(err) {
            processRequest();
          }
        );
      } else {
        processRequest();
      }
    });
  });
  // Start Development Server
  return server.start(() => callback( server ));
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});