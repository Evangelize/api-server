import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Presentations.findAll().then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      const recordId = new Buffer(id, 'hex');
      models.Presentations.findOne(
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
  getAllByUser(peopleId) {
    return new Promise((resolve, reject) => {
      const newPeopleId = new Buffer(peopleId, 'hex');
      models.Presentations.findAll(
        {
          where: {
            peopleId: newPeopleId,
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
    newrecord.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
    newrecord.peopleId = new Buffer(record.peopleId, 'hex');
    newrecord.shared = (record.shared === 'True') ? 1 : 0;
    newrecord.presentation = JSON.stringify(record.presentation);
    return new Promise((resolve, reject) => {
      models.Presentations.create(
        newrecord
      ).then(
        (result) => resolve(result)
      ).catch(
        (err) => reject(err)
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      const newrecord = Object.assign({}, record);
      newrecord.id = new Buffer(record.id, 'hex');
      newrecord.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
      newrecord.peopleId = new Buffer(record.peopleId, 'hex');
      newrecord.shared = (record.shared === 'True') ? 1 : 0;
      newrecord.presentation = JSON.stringify(record.presentation);
      models.Presentations.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.Presentations.findOne({
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
      models.Presentations.destroy({
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
