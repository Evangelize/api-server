import models from '../../models';
import Promise from 'bluebird';

export default {
  get(peopleId) {
    return new Promise(function(resolve, reject){
      peopleId = new Buffer(peopleId, 'hex');
      models.Users.findOne(
        {
          where: {
            peopleId: peopleId
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
      models.Users.create(
        record
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err)
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
      models.Users.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.Users.findOne({
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
  delete(record) {
    return new Promise(function(resolve, reject){
      models.Users.destroy({
        where: {
          id: new Buffer(record.id, 'hex')
        }
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
  }
};
