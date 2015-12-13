import axios from 'axios';
import _ from 'lodash';

export default {
  getConfigs() {
   return axios.get('/api/divisions/configs')
    .then(function (response) {
      return Promise.resolve({
        divisionConfigs: response.data
      });
    })
    .catch(function (response) {
      return Promise.resolve({
        data: response.data
      });
    });
  },
};
