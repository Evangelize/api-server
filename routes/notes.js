import api from '../src/lib/server';
const prefix = "/api/notes";
import utils from '../src/lib/utils';

module.exports = [
  {
    method: 'POST',
    path: prefix,
    handler: function (request, reply) {
      api
      .notes
      .add(
        request.payload
      )
      .then(
        function(results) {
          utils.pushMessage("notes.ADD_NOTE_FULFILLED", results);
          reply( results ).code( 200 );
        },
        function(err) {
          console.log(err);
          reply( err ).code( 200 );
        }
      );
    }
  },
  {
    method: 'PUT',
    path: prefix + '/{notesId}',
    handler: function (request, reply) {
      api
      .notes
      .updateNote(
        request.params.notesId,
        request.payload
      )
      .then(
        function(results) {
          utils.pushMessage("notes.UPDATE_NOTE_FULFILLED", results);
          reply( results ).code( 200 );
        },
        function(err) {
          console.log(err);
          reply( err ).code( 200 );
        }
      );
    }
  }
];
