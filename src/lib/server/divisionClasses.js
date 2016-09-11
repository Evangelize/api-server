import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.DivisionClasses.findAll({
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
      record.id = new Buffer(record.id, 'hex');
      record.divisionId = new Buffer(record.divisionId, 'hex');
      record.classId = new Buffer(record.classId, 'hex');
      models.DivisionClasses.create(
        record
      ).then(
        (result) => {
          resolve(result);
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
      models.DivisionClasses.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
        individualHooks: true,
        hooks: true,
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
  update(record) {
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      record.divisionId = new Buffer(record.divisionId, 'hex');
      record.classId = new Buffer(record.classId, 'hex');
      models.DivisionClasses.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        (rows) => {
          models.DivisionClasses.findOne({
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
};
