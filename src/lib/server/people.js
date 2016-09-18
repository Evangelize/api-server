import models from '../../models';
import Promise from 'bluebird';

export default {
  get(id) {
    return new Promise((resolve, reject) => {
      id = new Buffer(id, 'hex');
      models.People.findOne(
        {
          where: {
            id,
          },
        }
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  find(field, term) {
    return new Promise((resolve, reject) => {
      models.People.findAll({
        where: models.sequelize.where(models.sequelize.col(field), 'LIKE', `${term}%`),
        include: [
          {
            model: models.Teachers,
          },
          {
            model: models.Students,
          },
        ],
      }).then(
        (people) => {
          resolve(people);
          return null;
        },
        (err) => {
          reject(err);
          return null;
        }
      );
    });
  },
  all() {
    return new Promise((resolve, reject) => {
      models.People.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.People.create(
        record
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
          return null;
        }
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      models.People.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        (rows) => {
          models.People.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => {
              resolve(result);
            }
          );
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
  delete(record) {
    return new Promise((resolve, reject) => {
      models.People.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        (results) => {
          resolve(record);
        },
        (err) => {
          let result = {
            error: err,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
};
