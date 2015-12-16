import models from '../../models';
import attendance from './attendance'
import async from 'async';
import Promise from 'bluebird';
import moment from 'moment';

export default {
  addTeacher(divisionClassId, day, personId) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.DivisionClassTeachers.findOrCreate(
              {
                where: {
                  divisionClassId: divisionClassId,
                  peopleId: personId,
                  day: day
                }
              }
            ).spread(
              function(classTeacher, created) {
                callback(null, classTeacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(classTeacher, callback) {
            console.log(classTeacher);
            models.DivisionClasses.findOne(
              {
                where: {
                  id: divisionClassId
                },
                include: [
                  {
                    model: models.Classes
                  },
                  {
                    model: models.DivisionClassTeachers,
                    separate: true,
                    order: "day ASC",
                    include: [
                      {
                        model: models.People
                      }
                    ]
                  },
                  {
                    model: models.DivisionClassAttendance
                  }
                ]
              }
            ).then(
              function(divisionClass) {
                //console.log("divisionClasses", divisionClass);
                callback(null, divisionClass);
              },
              function(err){
                console.log(err);
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            console.log(error);
            reject(error);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  updateTeacher(classTeacherId, fields) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.DivisionClassTeachers.findOne(
              {
                where: {
                  id: classTeacherId
                }
              }
            ).then(
              function(teacher, created) {
                callback(null, teacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(classTeacher, callback) {
            classTeacher.update(
              fields
            ).then(
              function(teacher, created) {
                callback(null, teacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(teacher, callback) {
            models.DivisionClasses.findOne(
              {
                where: {
                  id: teacher.divisionClassId
                },
                include: [
                  {
                    model: models.Classes
                  },
                  {
                    model: models.DivisionClassTeachers,
                    separate: true,
                    order: "day ASC",
                    include: [
                      {
                        model: models.People
                      }
                    ]
                  },
                  {
                    model: models.DivisionClassAttendance
                  }
                ]
              }
            ).then(
              function(divisionClass) {
                callback(null, divisionClass);
              },
              function(err){
                console.log(err);
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            console.log(error);
            reject(error);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  deleteTeacher(classTeacherId) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.DivisionClassTeachers.findOne(
              {
                where: {
                  id: classTeacherId
                }
              }
            ).then(
              function(teacher, created) {
                callback(null, teacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(teacher, callback) {
            teacher
            .destroy()
            .then(
              function(people) {
                callback(null, teacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(teacher, callback) {
            models.DivisionClasses.findOne(
              {
                where: {
                  id: teacher.divisionClassId
                },
                include: [
                  {
                    model: models.Classes
                  },
                  {
                    model: models.DivisionClassTeachers,
                    separate: true,
                    order: "day ASC",
                    include: [
                      {
                        model: models.People
                      }
                    ]
                  },
                  {
                    model: models.DivisionClassAttendance
                  }
                ]
              }
            ).then(
              function(divisionClass) {
                callback(null, divisionClass);
              },
              function(err){
                console.log(err);
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            console.log(error);
            reject(error);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  updateAttendance(divisionClassId, day, attendanceDate, count) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.DivisionClassAttendance.findOrCreate(
              {
                where: {
                  divisionClassId: divisionClassId,
                  day: day,
                  attendanceDate: attendanceDate
                }
              }
            ).spread(
              function(attendance, created) {
                callback(null, attendance);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(attendance, callback) {
            attendance.update(
              {
                count: count
              }
            ).then(
              function(attendance, created) {
                callback(null, attendance);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(attendance, callback) {
            models.DivisionClasses.findOne(
              {
                where: {
                  id: divisionClassId
                },
                include: [
                  {
                    model: models.Classes
                  },
                  {
                    model: models.DivisionClassTeachers,
                    separate: true,
                    order: "day ASC",
                    include: [
                      {
                        model: models.People
                      }
                    ]
                  },
                  {
                    model: models.DivisionClassAttendance
                  }
                ]
              }
            ).then(
              function(divisionClass) {
                callback(null, divisionClass);
              },
              function(err){
                console.log(err);
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            console.log(error);
            reject(error);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
};
