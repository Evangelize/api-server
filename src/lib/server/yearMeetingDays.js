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
      models.YearMeetingDays.findAll({
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
      models.YearMeetingDays.findOne(
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
    let newrecord = Object.assign({}, record);
    newrecord.id = new Buffer(record.id, 'hex');
    newrecord.yearId = new Buffer(record.yearId, 'hex');
    return new Promise((resolve, reject) => {
      models.YearMeetingDays.create(
        newrecord
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      let newrecord = Object.assign({}, record);
      newrecord.id = new Buffer(record.id, 'hex');
      newrecord.yearId = new Buffer(record.yearId, 'hex');
      models.YearMeetingDays.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.YearMeetingDays.findOne({
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
      models.YearMeetingDays.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => resolve(record),
        (err) => reject(err)
      );
    });
  },
  getByYear(yearId) {
    return new Promise((resolve, reject) => {
      models.YearMeetingDays.findAll({
        where: {
          yearId: new Buffer(yearId, 'hex'),
        },
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
};
