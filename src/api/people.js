//import Promise from 'bluebird';
import axios from 'axios';
import _ from 'lodash';

const TIMEOUT = 100;

export default {
  get(key, filter) {
    return axios.get('/api/people/search/'+key+'/'+filter)
    .then(function (response) {
      //console.log(response);
      return Promise.resolve({
        key: key,
        filter: filter,
        data: response.data
      });
    })
    .catch(function (response) {
      return Promise.resolve({
        key: key,
        filter: filter,
        data: response.data
      });
    });
  },

  set(id, index, key, value) {
    if (value) {
      return axios.post(
        '/api/'+key+'s',
        {
          peopleId: id
        }
      )
      .then(function (response) {
        return Promise.resolve({
          id: id,
          index: index,
          key: key,
          value: value,
          data: response.data
        });
      })
      .catch(function (response) {
        return Promise.resolve({
          key: key,
          filter: filter,
          data: response.data
        });
      });
    } else {
      return axios.delete(
        '/api/'+key+'s/'+id
      )
      .then(function (response) {
        return Promise.resolve({
          id: id,
          index: index,
          key: key,
          value: value,
          data: response.data
        });
      })
      .catch(function (response) {
        return Promise.resolve({
          key: key,
          filter: filter,
          data: response.data
        });
      });
    }

  },
}
