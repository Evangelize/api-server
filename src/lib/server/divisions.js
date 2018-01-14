import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  all(entityId, lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    if (entityId) {
      where.entityId = entityId;
    }
    return new Promise((resolve, reject) => {
      models.Divisions.findAll({
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
  insert(record) {
    return new Promise((resolve, reject) => {
      models.Divisions.create(
        record
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      const newrecord = Object.assign({}, record);
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
      models.Divisions.destroy({
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
      models.Divisions.findOne({
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



