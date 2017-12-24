import {
  observable,
  autorun,
  computed,
  toJS,
  action
} from 'mobx';
import moment from 'moment-timezone';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import {
  firebaseAuth,
  googleProvider,
  facebookProvider,
  anonymousAuthenticate,
  googleAuthenticate,
  facebookAuthenticate,
  currentUser,
  fetchProvidersForEmail,
} from '../lib/auth';
import api from '../api';

const cookieUserKey = 'evangelize-user-id';
const accessToken = 'accessToken';

export default class Auth {
  client;
  events;
  request;
  @observable authenticated = false;
  @observable user;
  @observable userId;
  @observable authToken;

  init(events, options) {
    if (options) {
      this.options = options;
    }
    if (events) {
      this.setupEvents(events);
    }
  }

  @action setUser(user) {
    this.user = user;
  }

  setupAuth(authenticated) {
    const self = this;
    const auth = firebaseAuth();
    this.authenticated = (authenticated) ? authenticated : false;
    auth.onAuthStateChanged((user) => {
      if (user) {
        const currUser = currentUser();
        self.user = {
          firebase: user,
          db: null,
          userId: user.uid,
        };
        Cookie.set(cookieUserKey, self.userId, { expires: 7 });
        console.log('user auth', user);
        self.finalizeLogin();
      } else {
        self.user.firebase = null;
        self.user.db = null;
        self.userId = null;
        Cookie.remove(cookieUserKey);
        console.log('user logged out');
      }
    });
  }

  @action async checkUser() {
    const { jwt, user } = await api.auth.thirdPartyLogin('google', this.user.firebase);
    return user;
  }

  async login(type) {
    const self = this;
    let results;
    let error;
    let providers;
    if (this.user && this.user.firebase) {
      results = this.user.firebase;
    } else {
      try {
        if (type === 'facebook' && self.user && self.user.firebase) {
          results = await currentUser().linkWithPopup(facebookProvider);
        } else if (type === 'facebook') {
          results = await facebookAuthenticate();
        } else if (type === 'google' && self.user && self.user.firebase) {
          results = await currentUser().linkWithPopup(googleProvider);
        } else if (type === 'google') {
          results = await googleAuthenticate();
        }
        self.user = {
          firebase: results,
          db: null,
        };
        self.userId = self.user.firebase.user.uid;
        const result = await api.auth.thirdPartyLogin(type, results);
        const tokn = jwtDecode(result.jwt);
        Cookie.set(accessToken, result.jwt, { expires: moment(tokn.exp, 'X').toDate() });
        self.authenticated = true;
        console.log('user', result.user);
        self.user.db = result.user;
      } catch (e) {
        error = e;
        if (error.code === 'auth/account-exists-with-different-credential') {
          providers = await fetchProvidersForEmail(error.email);
          console.log(providers);
        }
        
      }
    }
    console.log(error, results);
    return { error, results, providers };
  }

  getUserCookie() {
    return Cookie.get(cookieUserKey);
  }

  async finalizeLogin() {
    await this.getAuthToken();
    // this.setupRefreshToken();
    // this.setupRequest();
    this.user.db = await this.checkUser();
    // this.setupUserProfile()
  }

  setupEvents(events) {
    this.events = events;
    this.events.on('auth', this.send.bind(this));
  }

  async getAuthToken(force) {
    this.authToken = await this.user.firebase.getIdToken(true);
    return this.authToken;
  }

  setupRequest() {
    this.request = axios.create({
      timeout: 10000,
      headers: { 'X-Authorization': this.authToken },
    });

    this.request.interceptors.response.use(
      null, 
      (error) => {
        if (error.response && error.response.status === 401) {
          window.location = '/login';
        }
        console.log('error', error);
        throw error
      }
    )
  }

  authenticate(email, password, callback) {
    const self = this;
    api.auth.login(email, password)
    .then(
      (result) => {
        const token = jwtDecode(result.jwt);
        Cookie.set(accessToken, result.jwt, { expires: moment(tokn.exp, 'X').toDate() });
        self.authenticated = true;
        console.log('user', result.user);
        self.user.db = result.user;
        callback(self.authenticated);
      },
      (err) => {
        console.log('unauthorized', err);
        callback(self.authenticated);
      }
    );
  }

  @computed get userFullName() {
    const name = (this.user && this.user.db && this.user.db.person) ? this.user.db.person.firstName + ' ' + this.user.db.person.lastName : 'User Name';
    return name;
  }

}
