/* eslint-disable no-console */
const env = process.env.NODE_ENV || 'development';

import path from 'path';
import async from 'async';
import nconf from 'nconf';
import etag from 'etag';
import loki from 'lokijs';

// Hapi server imports
import Hapi from 'hapi';
import Inert from 'inert';
import h2o2 from 'h2o2';
import vision from 'vision';
import hapiRouter from 'hapi-router';

// React imports
import React from "react";
import ReactDOM from "react-dom/server";
import Transmit from 'react-transmit';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';
// import {renderToString} from 'react-dom/server';

// React-router routes and history imports
import routes from '../src/routes';
import app from '../src/reducers';
import models from '../src/models';
import * as types from '../src/constants';
import initialState from '../src/initialState';
import api from '../src/lib/server';
import utils from '../src/lib/utils';
import createLocation from 'history/lib/createLocation';
import createHistory from 'history/lib/createMemoryHistory';

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
        }
      ],
      settings = nconf.argv()
       .env()
       .file({ file: path.join(__dirname, '../config/settings.json') });
  console.log("mysql", settings.get("mysql"));
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

    /**
    * Attempt to serve static requests from the public folder.
    */

    server.ext( 'onPreResponse', ( request, reply ) => {
      let retFunc = function(data, db) {
        let initState = (data) ? data : initialState();
        const store = applyMiddleware(promiseMiddleware())(createStore)(app, initState);
        /*
          store.dispatch({
            type: types.GET_DIVISION_CONFIGS_FULFILLED,
            payload: data
          });

          store.dispatch({
            type: types.GET_ATTENDANCE_FULFILLED,
            payload: data
          });

          store.dispatch({
            type: types.GET_NOTES_FULFILLED,
            payload: data
          });
        */
        const finalState = JSON.stringify(store.getState()),
              finalData = JSON.stringify(data),
              finalDb = db.serialize();

        match({ routes, location }, ( error, redirectLocation, renderProps ) => {
          if ( error || !renderProps ) {
            // reply("500: " + error.message)
            reply.continue();
          } else if ( redirectLocation ) {
            reply.redirect( redirectLocation.pathname + redirectLocation.search );
          } else if ( renderProps ) {
            // reply(renderToString( <RoutingContext {...renderProps} /> ))
            const reactString = ReactDOM.renderToString(
              <Provider store={store}>
                <RoutingContext {...renderProps} />
              </Provider>
            );
            let settings = nconf.argv()
               .env()
               .file({ file: path.join(__dirname, '../config/settings.json') });
            //console.log("websocket",  path.join(__dirname, '../config/settings.json'), settings.get("websocket"));
            const script = process.env.NODE_ENV === 'production' ? '/dist/client.min.js' : '/hot/client.js',
                  websocketUri =  settings.get("websocket:host")+":"+settings.get("websocket:port");
            let output = (
              `<!doctype html>
              <html lang="en-us">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Congregation Class Management</title>
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css" />
                  <link rel="stylesheet" href="/chartist/css/chartist.min.css">
                  <link rel="shortcut icon" sizes="16x16 32x32 48x48 64x64 128x128 256x256" href="/favicon.ico?v2">
                  <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.3.15/slick.css" />
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.11.0/css/medium-editor.css" />
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.11.0/css/themes/default.css" />
                  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                  <link rel="stylesheet" href="/css/custom.css" />
                </head>
                <body>
                  <div id="root"><div>${reactString}</div></div>
                  <script>
                    var dbJson = ${finalDb},
                        db;
                    window.__initialData__ = ${finalData};
                    window.__INITIAL_STATE__ = ${finalState};
                    window.__websocketUri = "${websocketUri}";
                  </script>
                  <script async=async src=${script}></script>
                </body>
              </html>`
            );
            let eTag = etag(output);
            reply(output).header('cache-control', 'max-age=0, private, must-revalidate').header('etag', eTag);
          }
        });
      };

      if ( typeof request.response.statusCode !== 'undefined' ) {
        return reply.continue();
      }
      if (typeof(window) == 'undefined'){
        global.window = new Object();
      }

      const {headers} = request;

      global.navigator = {
        userAgent: headers['user-agent']
      };
      const location = createLocation( request.path );

      utils
      .getAllTables()
      .then(
        function(results) {
          let db = new loki('classes'),
              data = {};
          async.forEachOf(
            results,
            function (value, key, callback) {
              let coll = db.addCollection(key,{asyncListeners: true, disableChangesApi: false});
              coll.insert(value);
              data[key] = coll;
              callback(null);
            },
            function (err) {
              retFunc(data, db);
            }
          )
        },
        function(err) {
          console.log(err);
          retFunc(null);
        }
      );
    });
  });
  // Start Development Server
  return server.start(() => callback( server ));
}
