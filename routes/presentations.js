import api from '../src/lib/server';
import iouuid from 'innodb-optimized-uuid';
const prefix = '/api';

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/presentations`,
    handler: (request, reply) => {
      const user = request.auth.credentials;
      const presentation = Object.assign(
        {},
        request.payload,
        {
          id: iouuid.generate().toLowerCase(),
          peopleId: user.id,
          entityId: user.entityId,
        }
      );
      return api.presentations.insert(presentation);
    },
  },
  {
    method: 'PATCH',
    path: `${prefix}/presentations/{id}`,
    handler: (request, reply) => {
      const user = request.auth.credentials;
      const presentation = Object.assign(
        {},
        request.payload,
        {
          id: request.params.id,
          peopleId: user.id,
          entityId: user.entityId,
        }
      );
      return api.presentations.update(presentation);
    },
  },
  {
    method: 'GET',
    path: `${prefix}/presentations`,
    handler: (request, h) => {
      const peopleId = request.auth.credentials.id;
      if (peopleId) {
        return api.presentations.getAllByUser(peopleId);
      } else {
        return { success: false };
      }
    },
  },
  {
    method: 'GET',
    path: `${prefix}/presentations/{id}`,
    handler: (request, reply) => {
      const id = request.params.id;
      return api.presentations.get(id);
    },
  },
];
