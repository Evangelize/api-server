import api from '../src/lib/server';
const prefix = "/api/students";

module.exports = [
  {
    method: 'POST',
    path: prefix,
    handler: function (request, h) {
      return api
      .students
      .add(request.payload.peopleId);
    },
  },
   {
    method: 'DELETE',
    path: `${prefix}/{peopleId}`,
    handler: function (request, h) {
      return api
      .students
      .delete(request.params.peopleId);
    },
  },
];
