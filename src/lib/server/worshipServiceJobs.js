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
      models.WorshipServiceJobs.findAll({
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
      models.WorshipServiceJobs.findOne(
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
    newrecord.jobId = new Buffer(record.jobId, 'hex');
    return new Promise((resolve, reject) => {
      models.WorshipServiceJobs.create(
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
      newrecord.jobId = new Buffer(record.jobId, 'hex');
      models.WorshipServiceJobs.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.WorshipServiceJobs.findOne({
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
      models.WorshipServiceJobs.destroy({
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
