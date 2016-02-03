import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import Nes from 'nes/client';
import moment from 'moment';
import loki from 'lokijs';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, Link } from 'react-router';
import { syncReduxAndRouter } from 'redux-simple-router';
import { Provider, connect } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import routes from './routes';
import { createHistory } from 'history';
import app from './reducers';
import initialState from './initialState';
let rehydrate = function() {
  db = new loki();
  db.loadJSON(JSON.stringify(window.dbJson));
  db.collections.forEach(function(coll, index){
    window.__INITIAL_STATE__[coll.name] = coll;
    coll.on('update', function (target) {
      console.log(coll, "update", target);
    });
    coll.on('insert', function (target) {
      console.log(coll, "update", target);
    });
  });

  return window.__INITIAL_STATE__;
}
// Grab the state from a global injected into server-generated HTML
//db = new loki('classes');
/*
collections.averageAttendance = db.addCollection('averageAttendance',{asyncListeners: true, disableChangesApi: true});
collections.averageAttendance.insert(window.__initialData__.attendance.average);
collections.latestAttendance = db.addCollection('latestAttendance',{asyncListeners: true, disableChangesApi: true});
collections.latestAttendance.insert(window.__initialData__.attendance.latest);
*/
const initState = rehydrate() || initialState();
const store = applyMiddleware(promiseMiddleware())(createStore)(app, initState);
const history = createHistory();
syncReduxAndRouter(history, store);

const rootElement = document.getElementById('root');

let websocketUri = (window.__websocketUri) ? window.__websocketUri : "localhost:3002";
console.log("websocket",'ws://'+websocketUri );
let wsclient = new Nes.Client('ws://'+websocketUri);
wsclient.connect(function (err) {

  let handler = function (update) {
    console.log("websocket:", update);
    store.dispatch(update);
  };

  wsclient.subscribe(
    '/attendance',
    handler,
    (err) => {
      console.log("websocket error:", err);
    }
  );

  wsclient.subscribe(
    '/classes',
    handler,
    (err) => {
      console.log("websocket error:", err);
    }
  );

  wsclient.subscribe(
    '/notes',
    handler,
    (err) => {
      console.log("websocket error:", err);
    }
  );
});

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Router history={history} routes={routes}>
          </Router>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));


if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
  module.hot.dispose(function() {

  });
}
