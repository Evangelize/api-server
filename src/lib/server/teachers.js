import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  add(personId) {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.Teachers.findOrCreate(
              {
                where: {
                  peopleId: personId,
                },
              }
            ).spread(
              (teacher) => callback(null, teacher),
              (err) => callback(err)
            );
          },
          (teacher, callback) => {
            models.Teachers.findOne(
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
              (result) => callback(null, result),
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
            models.Teachers.findOne(
              {
                where: {
                  peopleId: personId,
                },
              }
            ).then(
              (result) => callback(null, result),
              (err) => callback(err)
            );
          },
          (teacher, callback) => {
            teacher
            .destroy()
            .then(
              () => callback(null, teacher),
              (err) => callback(err)
            );
          },
          (teacher, callback) => {
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
              (result) => callback(null, result),
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
  all() {
    return new Promise((resolve, reject) => {
      models.Teachers.findAll(
        {
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
  update(record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      models.DivisionClassTeachers.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.DivisionClassTeachers.findOne({
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
};
