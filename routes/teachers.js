import api from '../src/lib/server';
const prefix = "/api/teachers";

module.exports = [
  {
    method: 'POST',
    path: prefix,
    handler: function (request, reply) {
      api
      .teachers
      .add(request.payload.peopleId)
      .then(
        function(results) {
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
    method: 'DELETE',
    path: prefix + "/{peopleId}",
    handler: function (request, reply) {
      api
      .teachers
      .delete(request.params.peopleId)
      .then(
        function(results) {
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
