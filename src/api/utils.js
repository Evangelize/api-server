//import Promise from 'bluebird';
import axios from 'axios';
import _ from 'lodash';

const prefix = '/api/utils';
const TIMEOUT = 100;

export default {
  uploadAvatar(id, type, file, fileName, mimeType, entityId) {
    return axios.post(
      `${prefix}/upload/${id}/avatar`,
      {
        file,
        type,
        fileName,
        mimeType,
        entityId,
      }
    );
  },
}
