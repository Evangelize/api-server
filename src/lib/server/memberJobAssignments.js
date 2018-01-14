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
      models.MemberJobAssignments.findAll({
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
  get(id) {
    return new Promise((resolve, reject) => {
      const recordId = new Buffer(id, 'hex');
      models.MemberJobAssignments.findOne(
        {
          where: {
            id: recordId,
          },
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
    newrecord.worshipServiceId = new Buffer(record.worshipServiceId, 'hex');
    newrecord.personId = new Buffer(record.personId, 'hex');
    newrecord.jobId = new Buffer(record.jobId, 'hex');
    return new Promise((resolve, reject) => {
      models.MemberJobAssignments.create(
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
      newrecord.worshipServiceId = new Buffer(record.worshipServiceId, 'hex');
      newrecord.personId = new Buffer(record.personId, 'hex');
      newrecord.jobId = new Buffer(record.jobId, 'hex');
      models.MemberJobAssignments.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.MemberJobAssignments.findOne({
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
      models.MemberJobAssignments.destroy({
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
