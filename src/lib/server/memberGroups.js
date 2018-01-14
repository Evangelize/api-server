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
      models.MemberGroups.findAll(
        {
          where,
          order: 'id ASC',
        }
      ).then(
        (attendance) => resolve(attendance),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = new Buffer(record.entityId, 'hex');
    record.personId = new Buffer(record.personId, 'hex');
    record.groupId = new Buffer(record.groupId, 'hex');
    return new Promise((resolve, reject) => {
      models.MemberGroups.create(
        record
      ).then(
        (result) => resolve(result),
        () => {
          models.MemberGroups.findOne(
            {
              where: {
                id: record.id,
              },
            }
          ).then(
            (result) => resolve(result),
            (error) => reject(error)
          );
        }
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      record.entityId = new Buffer(record.entityId, 'hex');
      record.personId = new Buffer(record.personId, 'hex');
      record.groupId = new Buffer(record.groupId, 'hex');
      models.MemberGroups.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.MemberGroups.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => resolve(result),
            (error) => reject(error)
          );
        },
        (err) => reject(err)
      );
    });
  },
  delete(record) {
    return new Promise((resolve, reject) => {
      models.MemberGroups.destroy({
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
