import { JL } from 'jsnlog';
import moment from 'moment-timezone';
import uid from 'innodb-optimized-uuid';
const jsnlogNodejs = require('jsnlog-nodejs').jsnlog_nodejs;
import api from '../src/lib/server';
const prefix = '/api/logging';

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/add`,
    config: {
      auth: false,
    },
    handler: (request, h) => {
      const now = moment().utc().valueOf();
      const record = {
        id: uid.generate(),
        error: JSON.stringify(request.payload),
        createdAt: now,
        updatedAt: now,
        deleted: null,
      };
      return api.errors.insert(record);
    },
  },
];
