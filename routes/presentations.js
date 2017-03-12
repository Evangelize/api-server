import api from '../src/lib/server';
import iouuid from 'innodb-optimized-uuid';
const prefix = '/api';

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/presentations`,
    config: {
      auth: 'authBearer',
    },
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
      api.presentations
      .insert(presentation)
      .then(
        (results) => reply({ results }).code(200),
        (err) => reply({ err }).code(500)
      )
      .catch(
        (err) => reply({ err }).code(500)
      );
    },
  },
  {
    method: 'PATCH',
    path: `${prefix}/presentations/{id}`,
    config: {
      auth: 'authBearer',
    },
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
      api.presentations
      .update(presentation)
      .then(
        (results) => reply(results).code(200),
        (err) => reply({ err }).code(500)
      )
      .catch(
        (err) => reply({ err }).code(500)
      );
    },
  },
  {
    method: 'GET',
    path: `${prefix}/presentations`,
    config: {
      auth: 'authBearer',
    },
    handler: (request, reply) => {
      const peopleId = request.auth.credentials.id;
      api.presentations
      .getAllByUser(peopleId)
      .then(
        (results) => reply({ results }).code(200),
        (err) => reply({ err }).code(500)
      );
    },
  },
  {
    method: 'GET',
    path: `${prefix}/presentations/{id}`,
    config: {
      auth: 'authBearer',
    },
    handler: (request, reply) => {
      const id = request.params.id;
      api.presentations
      .get(id)
      .then(
        (results) => reply(results).code(200),
        (err) => reply({ err }).code(500)
      );
    },
  },
];
