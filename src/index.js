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
import Stores from './stores';
import Sockets from './stores/sockets';
import routes from './routes';
import { browserHistory, Router } from 'react-router';
import EventEmitter from 'eventemitter3';
const stores = new Stores();

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
  const r = routes(stores.stores.settings);
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
      stores.stores.settings.authenticated = true;
      stores.stores.settings.user = JSON.parse(user);
      db.setEntityId(stores.stores.settings.user.entityId);
      render();
    }
  );
  // console.log('db', db);
} else {
  db = new Db(window.dbJson, events);
  stores.init(db, events).then(
    (data) => {
      console.log(stores);
      stores.stores.settings.authenticated = false;
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
