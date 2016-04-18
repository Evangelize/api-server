import Promise from 'bluebird';
import axios from 'axios';
import _ from 'lodash';
import reactCookie from 'react-cookie';

const TIMEOUT = 100;

export default {
  login(email, password) {
    return axios.post(
        '/api/auth/login',
        {
          email: email,
          password: password
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (response) {
        return response.data;
      });
  }
}
