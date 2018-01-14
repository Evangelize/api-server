import models from '../../models';
import Promise from 'bluebird';
import people from './people';

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
      models.YearClassStudents.findAll({
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
      models.YearClassStudents.findOne(
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
    newrecord.yearId = new Buffer(record.yearId, 'hex');
    newrecord.classId = new Buffer(record.classId, 'hex');
    newrecord.peopleId = new Buffer(record.peopleId, 'hex');
    return new Promise((resolve, reject) => {
      models.YearClassStudents.create(
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
      newrecord.yearId = new Buffer(record.yearId, 'hex');
      newrecord.classId = new Buffer(record.classId, 'hex');
      newrecord.peopleId = new Buffer(record.peopleId, 'hex');
      models.YearClassStudents.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.YearClassStudents.findOne({
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
      models.YearClassStudents.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => resolve(record),
        (err) => reject(err)
      );
    });
  },
  getByClassYear(yearId, classId) {
    return models.YearClassStudents.findAll({
      where: {
        yearId: new Buffer(yearId, 'hex'),
        classId: new Buffer(classId, 'hex'),
      },
    })
    .then(
      (results) => Promise.map(results, (result) => people.get(result.peopleId)),
    );
  },
};
