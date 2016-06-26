import { extendObservable, observable, computed, autorun, isObservable, isObservableMap, map } from "mobx";
import _ from 'lodash';
import loki from 'lokijs';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';
import reactCookie from 'react-cookie';
import jwt from 'jsonwebtoken';

export default class Settings {
  @observable authenticated = false;
  @observable user = null;
  ws;
  events;
  constructor(websocket, events) {
    //console.log("settings class");
    if (websocket) {
      this.setupWs(websocket);
    }

    if (events) {
      this.setupEvents(events);
    }
  }
  
  setupWs(websocket) {
    this.ws = websocket;

    this.ws.on('global', data => {
      //console.log('settings', 'global', data);
      //self.wsHandler(self.ws, data);
    });

    this.ws.on('connect', () => {
      //console.log('settings', "websocket: connected");
    });

    this.ws.on('settings', 'error', err => {
      //self.wsError(err);
    });
  }

  setupEvents(events) {
    this.events = events;
  }

  authenticate(email, password, callback) {
    let self = this;
    api.auth.login(email, password)
    .then(
      function(result) {
        let token = jwt.decode(result.jwt);
        reactCookie.save(
          'accessToken',
          result.jwt,
          {
            expires: moment(token.exp, "X").toDate(),
            path: '/'
          }
        );
        self.authenticated = true;
        console.log("user", result.user);
        self.user = result.user;
        callback(self.authenticated);
      },
      function(err){
        console.log("unauthorized", err);
        callback(self.authenticated);
      }
    );
  }
  
  @computed get userFullName() {
    let name = (this.user && this.user.person) ? this.user.person.firstName + " " + this.user.person.lastName : "User Name";
    return name;
  }
}
