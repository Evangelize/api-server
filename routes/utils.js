import fs from 'fs';
import api from '../src/lib/server';
import upload from '../src/lib/upload';
const prefix = '/api/utils/';

module.exports = [
  {
    method: 'POST',
    path: `${prefix}upload/{id}/avatar`,
    handler(request, reply) {
      const func = (request.payload.type === 'person') ? api.people : api.families;
      const update = (object) => {
        func
        .update(
          object
        )
        .then(
          (results) => {
            reply(results).code(200);
          },
          (err) => {
            reply(err).code(500);
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
          upload.photo(
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
              reply(err).code(500);
            }
          );
        },
        (err) => {
          console.log(err);
          reply(err).code(500);
        }
      );
    },
  },
];
