import api from '../src/lib/server';
const prefix = "/api/people/";

module.exports = [
  {
    method: 'GET',
    path: prefix + 'search/{searchType}/{search}',
    handler: function (request, reply) {
      api
      .people
      .add(
        request.params.searchType,
        request.params.search
      )
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
