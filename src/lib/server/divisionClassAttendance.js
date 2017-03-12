import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  latest() {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.DivisionClassAttendance.findAll(
              {
                group: ['attendanceDate'],
                order: 'attendanceDate DESC',
                limit: 8,
                attributes: [
                  'day',
                  'attendanceDate',
                  [
                    models.sequelize.fn('SUM', models.sequelize.col('count')),
                    'attendance',
                  ],
                ],
              }
            ).then(
              (attendance) => callback(null, attendance),
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
  average() {
    return new Promise((resolve, reject) => {
      models.sequelize.query(
        `
          SELECT AVG(t1.attendance) as attendance
          FROM (
            SELECT SUM(count) as attendance FROM divisionClassAttendance GROUP BY attendanceDate
          ) as t1
        `,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .then(
        (results) => resolve(results),
        (err) => reject(err)
      );
    });
  },
  all() {
    return new Promise((resolve, reject) => {
      models.DivisionClassAttendance.findAll(
        {
          order: 'id ASC',
        }
      ).then(
        (attendance) => resolve(attendance),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
    return new Promise((resolve, reject) => {
      models.DivisionClassAttendance.create(
        record
      ).then(
        (result) => resolve(result),
        () => {
          models.DivisionClassAttendance.findOne(
            {
              where: {
                divisionClassId: record.divisionClassId,
                day: 0,
                attendanceDate: '2016-05-01 00:00:00',
              },
            }
          ).then(
            (result) => resolve(result),
            (error) => reject(error)
          );
        }
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      models.DivisionClassAttendance.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.DivisionClassAttendance.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => resolve(result),
            (error) => reject(error)
          );
        },
        (err) => reject(err)
      );
    });
  },
  delete(record) {
    return new Promise((resolve, reject) => {
      models.DivisionClassAttendance.destroy({
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



