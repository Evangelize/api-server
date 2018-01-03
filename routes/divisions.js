import api from '../src/lib/server';
const prefix = "/api/divisions";

module.exports = [
  {
    method: 'GET',
    path: prefix + '/configs',
    handler: function (request, reply) {
      //reply('Hello ' + encodeURIComponent(request.params.user) + '!');
      return api
      .divisions
      .getDivisionConfigs();
    },
  },
];
