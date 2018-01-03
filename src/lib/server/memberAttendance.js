import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  latest() {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.MemberAttendance.findAll(
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
            SELECT SUM(count) as attendance FROM memberAttendance GROUP BY attendanceDate
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
  all(lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    return new Promise((resolve, reject) => {
      models.MemberAttendance.findAll(
        {
          where,
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
    record.entityId = new Buffer(record.entityId, 'hex');
    record.worshipServiceId = new Buffer(record.worshipServiceId, 'hex');
    record.personId = new Buffer(record.personId, 'hex');
    record.attendanceTypeId = new Buffer(record.attendanceTypeId, 'hex');
    return new Promise((resolve, reject) => {
      models.MemberAttendance.create(
        record
      ).then(
        (result) => resolve(result),
        () => {
          models.MemberAttendance.findOne(
            {
              where: {
                id: record.id,
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
      record.entityId = new Buffer(record.entityId, 'hex');
      record.worshipServiceId = new Buffer(record.worshipServiceId, 'hex');
      record.personId = new Buffer(record.personId, 'hex');
      record.attendanceTypeId = new Buffer(record.attendanceTypeId, 'hex');
      models.MemberAttendance.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.MemberAttendance.findOne({
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
      models.MemberAttendance.destroy({
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
