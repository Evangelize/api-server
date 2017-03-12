import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Users.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  get(peopleId) {
    return new Promise((resolve, reject) =>{
      peopleId = new Buffer(peopleId, 'hex');
      models.Users.findOne(
        {
          where: {
            peopleId: peopleId,
          },
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.Users.create(
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
      models.Users.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.Users.findOne({
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
      models.Users.destroy({
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
