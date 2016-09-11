import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Families.findAll({
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
  get(id) {
    return new Promise(function(resolve, reject){
      id = new Buffer(id, 'hex');
      models.Families.findOne(
        {
          where: {
            id: id
          }
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
      models.Families.create(
        record
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          let result = {
            error: err,
            record: null
          };
          reject(result);
          return null;
        }
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      models.Families.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.Families.findOne({
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
      models.Families.destroy({
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
