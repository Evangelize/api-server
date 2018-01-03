import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  add(personId) {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.Students.findOrCreate(
              {
                where: {
                  peopleId: personId,
                },
              }
            ).spread(
              (student) => callback(null, student),
              (err) => callback(err)
            );
          },
          (student, callback) => {
            models.People.findOne(
              {
                where: {
                  id: personId,
                },
                include: [
                  {
                    model: models.Teachers,
                  },
                  {
                    model: models.Students,
                  },
                ],
              }
            ).then(
              (people) => callback(null, people),
              (err) => callback(err)
            );
          },
        ],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      );
    });
  },
  delete(personId) {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.Students.findOne(
              {
                where: {
                  peopleId: personId,
                },
              }
            ).then(
              (student) => callback(null, student),
              (err) => callback(err)
            );
          },
          (student, callback) => {
            student
            .destroy()
            .then(
              () => callback(null, student),
              (err) => callback(err)
            );
          },
          (student, callback) => {
            models.People.findOne(
              {
                where: {
                  id: personId,
                },
                include: [
                  {
                    model: models.Teachers,
                  },
                  {
                    model: models.Students,
                  },
                ],
              }
            ).then(
              (people) => callback(null, people),
              (err) => callback(err)
            );
          },
        ],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      );
    });
  },
  all(lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    return new Promise((resolve, reject) => {
      models.Students.findAll(
        {
          where,
          order: [
            ['updatedAt', 'DESC'],
          ],
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
};
