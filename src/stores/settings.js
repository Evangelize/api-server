import {
  extendObservable,
  observable,
  computed,
  autorun,
  isObservable,
  isObservableMap,
  map
} from 'mobx';
import moment from 'moment-timezone';
import api from '../api';
import * as types from '../constants';
import conv from 'binstring';
import iouuid from 'innodb-optimized-uuid';
import reactCookie from 'react-cookie';
import jwtDecode from 'jwt-decode';

export default class Settings {
  @observable authenticated = false;
  @observable user = null;
  @observable leftNavOpen = false;
  ws;
  events;
  constructor(db, events) {
    if (events) {
      this.setupEvents(events);
    }
  }

  setupEvents(events) {
    this.events = events;
  }

  authenticate(email, password, callback) {
    const self = this;
    api.auth.login(email, password)
    .then(
      (result) => {
        const token = jwtDecode(result.jwt);
        reactCookie.save(
          'accessToken',
          result.jwt,
          {
            expires: moment(token.exp, 'X').toDate(),
            path: '/',
          }
        );
        self.authenticated = true;
        console.log('user', result.user);
        self.user = result.user;
        callback(self.authenticated);
      },
      (err) => {
        console.log('unauthorized', err);
        callback(self.authenticated);
      }
    );
  }

  thirdPartyLogin(type, token, callback) {
    const self = this;
    api.auth.thirdPartyLogin(type, token)
    .then(
      (result) => {
        const tokn = jwtDecode(result.jwt);
        reactCookie.save(
          'accessToken',
          result.jwt,
          {
            expires: moment(tokn.exp, 'X').toDate(),
            path: '/',
          }
        );
        self.authenticated = true;
        console.log('user', result.user);
        self.user = result.user;
        callback(self.authenticated);
      },
      (err) => {
        console.log('unauthorized', err);
        callback(self.authenticated);
      }
    );
  }

  @computed get userFullName() {
    let name = (this.user && this.user.person) ? this.user.person.firstName + ' ' + this.user.person.lastName : 'User Name';
    return name;
  }
}