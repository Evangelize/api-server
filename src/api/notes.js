//import Promise from 'bluebird';
import axios from 'axios';
import _ from 'lodash';

const TIMEOUT = 100;

export default {
  get(key, filter) {
    return axios.get('/api/people/search/'+key+'/'+filter)
    .then(function (response) {
      console.log(response);
      return Promise.resolve({
        key: key,
        filter: filter,
        data: response.data
      });
    })
    .catch(function (response) {
      return Promise.reject({
        key: key,
        filter: filter,
        data: response.data
      });
    });
  },
  add(note) {
    return axios.post(
      '/api/notes',
      note
    )
    .then(function (response) {
      return Promise.resolve({
        data: response.data
      });
    })
    .catch(function (response) {
      return Promise.reject({
        data: response.data
      });
    });

  },
  update(note, changes) {
    return axios.put(
      '/api/notes/'+note.id,
      changes
    )
    .then(function (response) {
      return Promise.resolve({
        id: note.id,
        data: response.data
      });
    })
    .catch(function (response) {
      return Promise.reject({
        id: note.id,
        data: response.data
      });
    });

  },
}
