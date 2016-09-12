import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.DivisionClassTeachers.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (results) => {
          resolve(results);
          return null;
        },
        (err) => {
          console.log(error);
          reject(error);
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
      record.dayId = new Buffer(record.dayId, 'hex');
      models.DivisionClassTeachers.create(
        record
      ).then(
        function(result) {
          resolve(result);
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
          let result = {
            error: err,
            record: null
          };
          reject(result);
        }
      );
    });
  },
  update(record) {
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      record.peopleId = new Buffer(record.peopleId, 'hex');
      record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
      record.dayId = new Buffer(record.dayId, 'hex');
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
