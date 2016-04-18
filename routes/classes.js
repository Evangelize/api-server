import api from '../src/lib/server';
import utils from '../src/lib/utils';
const prefix = "/api/classes";

module.exports = [
  {
    method: 'POST',
    path: prefix + '/{classId}/teacher',
    handler: function (request, reply) {
      api
      .classes
      .addTeacher(
        request.payload.divisionClassId,
        request.payload.day,
        request.payload.peopleId
      )
      .then(
        function(results) {
          utils.pushMessage("classes.UPDATE_DIVISION_CLASS_TEACHER_FULFILLED", results);
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
    path: prefix + '/{classId}/teacher/{classTeacherId}',
    handler: function (request, reply) {
      api
      .classes
      .updateTeacher(
        request.params.classTeacherId,
        request.payload
      )
      .then(
        function(results) {
          utils.pushMessage("classes.UPDATE_DIVISION_CLASS_TEACHER_FULFILLED", results);
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
    path: prefix + '/{classId}/teacher/{classTeacherId}',
    handler: function (request, reply) {
      //console.log(request.params);
      api
      .classes
      .deleteTeacher(
        request.params.classTeacherId
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
  },
  {
    method: 'POST',
    path: prefix + '/{classId}/attendance/{day}',
    handler: function (request, reply) {
      api
      .classes
      .updateAttendance(
        request.params.classId,
        request.params.day,
        request.payload.attendanceDate,
        request.payload.count
      )
      .then(
        function(results) {
          utils.pushMessage("attendance.UPDATE_DIVISION_CLASS_ATTENDANCE_FULFILLED", results);
          utils.pushLast8Attenance().then(
            function(results) {
              //console.log(results);
            },
            function(err) {
              console.log(err);
            }
          );
          utils.pushAvgAttendance().then(
            function(results) {
              //console.log(results);
            },
            function(err) {
              console.log(err);
            }
          );
          reply( results ).code( 200 );
        },
        function(err) {
          console.log(err);
          reply( err ).code( 200 );
        }
      );
    }
  },
];
