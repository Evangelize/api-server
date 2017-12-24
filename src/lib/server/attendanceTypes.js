import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.AttendanceTypes.findAll({
        order: [
          ['title', 'ASC'],
        ],
      }).then(
        (results) => resolve(results),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = new Buffer(record.entityId, 'hex');
    return new Promise((resolve, reject) => {
      models.AttendanceTypes.create(
        record
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = new Buffer(record.entityId, 'hex');
    return new Promise((resolve, reject) => {
      const newrecord = Object.assign({}, record);
      newrecord.id = new Buffer(record.id, 'hex');
      models.AttendanceTypes.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.AttendanceTypes.findOne({
            where: {
              id: newrecord.id,
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
  delete(record) {
    return new Promise((resolve, reject) => {
      models.AttendanceTypes.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => resolve(record),
        (err) => reject(err)
      );
    });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      models.AttendanceTypes.findOne({
        where: {
          id: new Buffer(id, 'hex'),
        },
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
};



