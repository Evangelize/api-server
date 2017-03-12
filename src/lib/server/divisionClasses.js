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
        (results) => resolve(results),
        (err) => reject(err)
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
        (result) => resolve(result),
        (err) => reject(err)
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
        () => resolve(record),
        (err) => reject(err)
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
        () => {
          models.DivisionClasses.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => resolve(result)
          );
        },
        (err) => reject(err)
      );
    });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      models.DivisionsClasses.findOne({
        where: {
          id: new Buffer(id, 'hex'),
        },
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  getByDivision(divisionId) {
    return new Promise((resolve, reject) => {
      models.DivisionClasses.findAll({
        where: {
          divisionId: new Buffer(divisionId, 'hex'),
        },
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
};
