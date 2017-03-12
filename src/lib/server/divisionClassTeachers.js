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
        (results) => resolve(results),
        (error) => reject(error)
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
        (result) => resolve(result),
        (err) => reject(err)
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
        () => resolve(record),
        (err) => reject(err)
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
        () => {
          models.DivisionClassTeachers.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => resolve(result),
            (err) => reject(err)
          );
        },
        (err) => reject(err)
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
        (result) => resolve(result),
        (err) => reject(err)
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
        (results) => Promise.map(results, (result) => people.get(result.peopleId)),
        (err) => reject(err)
      )
      .then(
        (results) => resolve(results),
        (err) => reject(err)
      );
    });
  },
};
