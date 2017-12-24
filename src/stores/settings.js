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

}