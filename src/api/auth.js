import axios from 'axios';

export default {
  login(email, password) {
    return axios.post(
      '/api/auth/login',
      {
        email,
        password,
      }
    )
    .then((response) => Promise.resolve(response.data))
    .catch((response) => Promise.reject(response.data));
  },
  thirdPartyLogin(type, token) {
    return axios.post(
      '/api/auth/thirdPartyLogin',
      {
        type,
        token,
      }
    )
    .then((response) => Promise.resolve(response.data))
    .catch((response) => Promise.reject(response.data));
  },
};
