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
        return Promise.resolve(response.data);
      })
      .catch(function (response) {
        return Promise.reject(response.data);
      });
  }
}
