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
  }
};
