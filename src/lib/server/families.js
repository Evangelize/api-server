import models from '../../models';
import Promise from 'bluebird';

export default {
  all(lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    return new Promise((resolve, reject) => {
      models.Families.findAll({
        where,
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (results) => resolve(results),
        (err) => reject(err)
      );
    });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      const newId = new Buffer(id, 'hex');
      models.Families.findOne(
        {
          where: {
            id: newId,
          },
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
    return new Promise((resolve, reject) => {
      models.Families.create(
        record
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      record.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
      models.Families.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.Families.findOne({
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
  delete(record) {
    return new Promise((resolve, reject) => {
      models.Families.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
};
