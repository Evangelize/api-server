import models from '../../models';
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
      models.Posts.findAll({
        where,
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  get(id, entityId) {
    return new Promise((resolve, reject) => {
      const recordId = new Buffer(id, 'hex');
      models.Posts.findOne(
        {
          where: {
            id: recordId,
          },
          entityId: new Buffer(entityId, 'hex'),
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    const newrecord = Object.assign({}, record);
    newrecord.id = new Buffer(record.id, 'hex');
    newrecord.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
    newrecord.authorId = (record.authorId) ? new Buffer(record.authorId, 'hex') : null;
    return new Promise((resolve, reject) => {
      models.Posts.create(
        newrecord
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
      newrecord.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
      newrecord.authorId = (record.authorId) ? new Buffer(record.authorId, 'hex') : null;
      models.Posts.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.Posts.findOne({
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
      models.Posts.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => resolve(record),
        (err) => reject(err)
      );
    });
  },
};
