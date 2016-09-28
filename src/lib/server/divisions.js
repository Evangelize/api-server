import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Divisions.findAll({
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
    return new Promise((resolve, reject) => {
      models.Divisions.create(
        record
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          const result = {
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
    return new Promise((resolve, reject) => {
      let newrecord = Object.assign({}, record);
      newrecord.id = new Buffer(record.id, 'hex');
      models.Divisions.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.Divisions.findOne({
            where: {
              id: newrecord.id,
            },
          }).then(
            (result) => {
              resolve(result);
            }
          );
        },
        (err) => {
          const result = {
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
      models.Divisions.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => {
          resolve(record);
        },
        (error) => {
          const result = {
            error,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      models.Divisions.findOne({
        where: {
          id: new Buffer(id, 'hex'),
        },
      }).then(
        (result) => {
          resolve(result);
        }
      );
    });
  },
};



