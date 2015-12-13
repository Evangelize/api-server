import api from '../src/lib/server';
const prefix = "/api/divisions";

module.exports = [
  {
    method: 'GET',
    path: prefix + '/configs',
    handler: function (request, reply) {
      //reply('Hello ' + encodeURIComponent(request.params.user) + '!');
      api
      .divisions
      .getDivisionConfigs()
      .then(
        function(configs) {
          reply( configs ).code( 200 );
        },
        function(err) {
          console.log(err);
          reply( err ).code( 200 );
        }
      );
    }
  }
];
