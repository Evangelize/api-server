import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';
import waterfall from 'async/waterfall';
import Promise from 'bluebird';
import io from 'socket.io-client';
import moment from 'moment';
import loki from 'lokijs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reactCookie from 'react-cookie';
import jwt from 'jsonwebtoken';
import Provider from './components/Provider';
import Db from './stores/db';
import Classes from './stores/classes';
import Settings from './stores/settings';
import routes from './routes';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';
import EventEmitter from 'eventemitter3';

class Root extends Component {
  render() {
    return (
      <div>
        <Provider context={this.props.context}>
          <Router history={this.props.history} routes={this.props.routes}></Router>
        </Provider>
      </div>
    );
  }
}

let db, settings, classes, r, context;
const events = new EventEmitter();
const rootElement = document.getElementById('root');
const cookie = reactCookie.load('accessToken');
const authenticated = function() {
  console.log("cookie", cookie);
  if (cookie) {
    return true;
  } else {
    return false;
  }
};

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

waterfall(
  [
    function(callback) {
      if (authenticated()) {
        let websocketUri = (window.wsUri) ? window.wsUri : "http://localhost:3002";
        console.log("websocketUri", websocketUri);
        let wsclient = io(websocketUri, {query: 'auth_token='+cookie});
        db = new Db();
        db.init(window.dbJson, wsclient).then(
          function(data) {
            console.log("db", db);
            settings = new Settings(wsclient, events);
            settings.authenticated = true;
            settings.user = JSON.parse(window.user);
            classes = new Classes(db, wsclient, events);
            callback(null);
          }
        );
      } else {
        db = new Db(window.dbJson);
        settings = new Settings();
        settings.authenticated = false;
        classes = new Classes(db);
        callback(null);
      }
      
    },
    function(callback) {
      r = routes(settings);
      context = {
        state: {
          db: db,
          classes: classes, 
          settings: settings
        },
        store: {

        }
      };
      callback(null);
    }
  ],
  function(err, result) {
    ReactDOM.render(<Root context={context} history={browserHistory} routes={r} />, document.getElementById('root'));  
  }
);

if (module.hot) {
  /*
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
  */
  module.hot.dispose(function() {

  });
}
