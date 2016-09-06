import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';
import { Provider } from 'mobx-react';
// import waterfall from 'async/waterfall';
// import Promise from 'bluebird';
// import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reactCookie from 'react-cookie';
import Db from './stores/db';
import Classes from './stores/classes';
import Settings from './stores/settings';
import Sockets from './stores/sockets';
import routes from './routes';
import { browserHistory, Router } from 'react-router';
import EventEmitter from 'eventemitter3';

class Root extends Component {
  render() {
    return (
      <div>
        <Provider {...this.props.context}>
          <Router history={this.props.history} routes={this.props.routes}></Router>
        </Provider>
        {__DEV__ &&
          <DevTools />
        }
      </div>
    );
  }
}

let db;
let settings;
let classes;
let r;
let context;
const events = new EventEmitter();
const sockets = new Sockets();
sockets.init(events);
const rootElement = document.getElementById('root');
const token = reactCookie.load('accessToken');
const authenticated = function () {
  let retVal;
  // console.log('cookie', token);
  if (token) {
    retVal = true;
  } else {
    retVal = false;
  }
  return retVal;
};

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (authenticated()) {
  db = new Db();
  db.init(window.dbJson, events);
  // console.log('db', db);
  settings = new Settings(null, events);
  settings.authenticated = true;
  settings.user = JSON.parse(window.user);
  classes = new Classes(db, null, events);
} else {
  db = new Db();
  db.init(window.dbJson, events);
  settings = new Settings();
  settings.authenticated = false;
  classes = new Classes(db);
}
r = routes(settings);
context = {
  db,
  classes,
  settings,
  sockets,
};

ReactDOM.render(<Root context={context} history={browserHistory} routes={r} />, rootElement);

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
