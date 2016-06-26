import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  add(personId) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.Teachers.findOrCreate(
              {
                where: {
                  peopleId: personId
                }
              }
            ).spread(
              function(teacher, created) {
                callback(null, teacher);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(teacher, callback) {
            models.Teachers.findOne(
              {
                where: {
                  id: personId
                },
                include: [
                  {
                    model: models.Teachers
                  },
                  {
                    model: models.Students
                  }
                ]
              }
            ).then(
              function(people) {
                callback(null, people);
              },
              function(err){
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            let result = {
              error: err,
              record: null
            };
            reject(result);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  delete(personId) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.Teachers.findOne(
              {
                where: {
                  peopleId: personId
                }
              }
            ).then(
              function(teacher) {
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
            models.People.findOne(
              {
                where: {
                  id: personId
                },
                include: [
                  {
                    model: models.Teachers
                  },
                  {
                    model: models.Students
                  }
                ]
              }
            ).then(
              function(people) {
                callback(null, people);
              },
              function(err){
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            let result = {
              error: err,
              record: null
            };
            reject(result);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  teachers() {
    return new Promise(function(resolve, reject){
      models.Teachers.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  divisionClassTeachers() {
    return new Promise(function(resolve, reject){
      models.DivisionClassTeachers.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      models.DivisionClassTeachers.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.DivisionClassTeachers.findOne({
            where: {
              id: record.id
            }
          }).then(
            function(result) {
              resolve(result);
            }
          );
        },
        function(err){
          let result = {
            error: err,
            record: null
          };
          reject(result);
        }
      );
    });
  },
};
