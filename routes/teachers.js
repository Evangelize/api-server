import api from '../src/lib/server';
const prefix = "/api/teachers";

module.exports = [
  {
    method: 'POST',
    path: prefix,
    handler: function (request, h) {
      return api
      .teachers
      .add(request.payload.peopleId);
    }
  },
  {
    method: 'DELETE',
    path: `${prefix}/{peopleId}`,
    handler: function (request, h) {
      return api
      .teachers
      .delete(request.params.peopleId);
    }
  }
];
