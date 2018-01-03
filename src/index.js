import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import EventEmitter from 'eventemitter3';
// import waterfall from 'async/waterfall';
// import Promise from 'bluebird';
// import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reactCookie from 'react-cookie';
import Root from './components/Root';
import Db from './stores/db';
import Stores from './stores';
import Sockets from './stores/sockets';
import routes from './routes';

const stores = new Stores();

let db;
const events = new EventEmitter();
const sockets = new Sockets();
sockets.init(events);
const rootElement = document.getElementById('root');
const token = reactCookie.load('accessToken');
const authenticated = () => {
  let retVal;
  // console.log('cookie', token);
  if (token) {
    retVal = true;
  } else {
    retVal = false;
  }
  return retVal;
};

const render = () => {
  const r = routes(stores.stores.auth);
  const context = Object.assign(
    {
      db,
      sockets,
    },
    stores.stores
  );

  ReactDOM.render(<Root context={context} history={browserHistory} routes={r} />, rootElement);
};

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (authenticated()) {
  db = new Db(window.dbJson, events);
  stores.init(db, events).then(
    (data) => {
      console.log(stores);
      const user = JSON.parse(window.user);
      stores.stores.auth.setupAuth(authenticated(), user);
      db.setEntityId(window.entityId);
      render();
      // stores.stores.auth.authenticated = true;
      // stores.stores.auth.user = JSON.parse(user);
    }
  );
  // console.log('db', db);
} else {
  db = new Db(window.dbJson, events);
  stores.init(db, events).then(
    (data) => {
      console.log(stores);
      stores.stores.auth.authenticated = false;
      render();
    }
  );
}


if (module.hot) {
  /*
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
  */
  module.hot.dispose(() => {

  });
}
