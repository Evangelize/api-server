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
          reply(results).code(200);
        },
        (err) => {
          console.log(err);
          reply(err).code(200);
        }
      );
    },
  },
  {
    method: 'POST',
    path: `${prefix}{id}/avatar`,
    handler(request, reply) {
      const updatePerson = (person) => {
        api
        .people
        .update(
          person
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

      api
      .people
      .get(
        request.params.id
      )
      .then(
        (results) => {
          upload.photo(
            request.body.fileName,
            request.body.file
          ).then(
            (url) => {
              const person = results.toJs();
              person.photoUrl = url;
              updatePerson(person);
            },
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
