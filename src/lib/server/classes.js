import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Classes.findAll({
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
    record.id = new Buffer(record.id, 'hex');
    return new Promise(function(resolve, reject){
      models.Classes.create(
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
  update(record) {
    console.log(record);
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      models.Classes.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.Classes.findOne({
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
  delete(record) {
    return new Promise(function(resolve, reject){
      models.Classes.destroy({
        where: {
          id: new Buffer(record.id, 'hex')
        }
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
  }
};
