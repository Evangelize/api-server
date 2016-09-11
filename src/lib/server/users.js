import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Users.findAll({
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
  get(peopleId) {
    return new Promise((resolve, reject) =>{
      peopleId = new Buffer(peopleId, 'hex');
      models.Users.findOne(
        {
          where: {
            peopleId: peopleId,
          },
        }
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.Users.create(
        record
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
          return null;
        }
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      models.Users.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        (rows) => {
          models.Users.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => {
              resolve(result);
            }
          );
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
  delete(record) {
    return new Promise((resolve, reject) => {
      models.Users.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        (results) => {
          resolve(record);
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
};
