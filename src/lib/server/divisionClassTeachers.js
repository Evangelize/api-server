import models from '../../models';
import async from 'async';
import Promise from 'bluebird';
import people from './people';

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
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      record.peopleId = new Buffer(record.peopleId, 'hex');
      record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
      record.dayId = new Buffer(record.dayId, 'hex');
      models.DivisionClassTeachers.create(
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
      models.DivisionClassTeachers.destroy({
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
      record.peopleId = new Buffer(record.peopleId, 'hex');
      record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
      record.dayId = new Buffer(record.dayId, 'hex');
      models.DivisionClassTeachers.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        (rows) => {
          models.DivisionClassTeachers.findOne({
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
  get(id) {
    return new Promise((resolve, reject) => {
      models.DivisionsClassTeachers.findOne({
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
  getByDivisionClassDay(divisionClassId, day) {
    return new Promise((resolve, reject) => {
      models.DivisionClassTeachers
      .findAll({
        where: {
          divisionClassId: new Buffer(divisionClassId, 'hex'),
          day,
        },
      })
      .then(
        (results) => Promise.map(results, (result) => people.get(result.peopleId))
      )
      .then(
        (results) => {
          resolve(results);
        }
      );
    });
  },
};
