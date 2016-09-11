import models from '../../models';
import Promise from 'bluebird';

export default {
  get(id) {
    return new Promise(function (resolve, reject) {
      id = new Buffer(id, 'hex');
      models.People.findOne(
        {
          where: {
            id,
          },
        }
      ).then(
        function (result) {
          resolve(result);
          return null;
        },
        function (err) {
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  find(field, term) {
    return new Promise(function (resolve, reject) {
      models.People.findAll({
        where: models.sequelize.where(models.sequelize.col(field), 'LIKE', term + '%'),
        include: [
          {
            model: models.Teachers,
          },
          {
            model: models.Students,
          },
        ],
      }).then(
        function (people) {
          resolve(people);
          return null;
        },
        function (err) {
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
};
