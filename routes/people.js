import fs from 'fs';
import api from '../src/lib/server';
import upload from '../src/lib/upload';
const prefix = '/api/people/';

module.exports = [
  {
    method: 'GET',
    path: `${prefix}search/{searchType}/{search}`,
    handler(request, reply) {
      api
      .people
      .find(
        request.params.searchType,
        request.params.search
      )
      .then(
        (results) => {
          //reply(results).code(200);
          return results;
        },
        (err) => {
          console.log(err);
          //reply(err).code(200);
          return err;
        }
      );
    },
  },
  {
    method: 'POST',
    path: `${prefix}{id}/avatar`,
    handler(request, reply) {
      const func = (request.payload.type === 'person') ? api.people : api.family;
      const update = (object) => {
        func
        .update(
          object
        )
        .then(
          (results) => {
            //reply(results).code(200);
            return results;
          },
          (err) => {
            //reply(err).code(500);
            return err;
          }
        );
      };

      func
      .get(
        request.params.id
      )
      .then(
        (results) => {
          const img = Buffer.from(request.payload.file.split(',')[1], 'base64');
          const url = `https://minio-eu1.evangelize.io/${request.payload.entityId}/${request.payload.fileName}`;
          return upload.photo(
            request.payload.entityId,
            request.payload.fileName,
            request.payload.mimeType,
            img,
          ).then(
            () => {
              const object = results.get();
              object.photoUrl = url;
              update(object);
            }
          ).catch(
            (err) => {
              console.log(err);
              //reply(err).code(500);
              return err;
            }
          );
        },
        (err) => {
          console.log(err);
          //reply(err).code(500);
          return err;
        }
      );
    },
  },
  {
    method: 'GET',
    path: `${prefix}{peopleId}/logins`,
    handler(request, reply) {
      return api
      .thirdPartyLogins
      .getPersonLogins(
        request.params.peopleId,
      );
    },
  },
  {
    method: 'GET',
    path: `${prefix}getUnconnectedLogins`,
    handler(request, reply) {
      return api.thirdPartyLogins.getUnconnectedLogins();
    },
  },
  {
    method: 'POST',
    path: `${prefix}connectLogin/{personId}`,
    handler(request, reply) {
      return api.thirdPartyLogins.connectLogin(
        request.params.personId,
        request.payload.entityId,
        request.payload.loginId,
      );
    },
  },
];
