import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  get() {
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
  insert(record) {
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      record.peopleId = new Buffer(record.peopleId, 'hex');
      record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
      models.DivisionClassTeachers.create(
        record
      ).then(
        function(result) {
          resolve(result);
        },
        function(err){
          console.log(err)
          reject(err);
        }
      );
    });
  },
  delete(record) {
    return new Promise(function(resolve, reject){
      models.DivisionClassTeachers.destroy({
        where: {
          id: new Buffer(record.id, 'hex')
        },
        individualHooks: true,
        hooks: true
      }).then(
        function(results) {
          resolve(record);
        },
        function(err){
          console.log(err)
          reject(err);
        }
      );
    });
  },
  update(record) {
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      record.peopleId = new Buffer(record.peopleId, 'hex');
      record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
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
          console.log(err)
          reject(err);
        }
      );
    });
  },
};
