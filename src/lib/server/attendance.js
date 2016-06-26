import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  latest() {
    return new Promise(function(resolve, reject){
       async.waterfall(
        [
          function(callback) {
            //console.log("Get Attendance");
            models.DivisionClassAttendance.findAll(
              {
                group: ['attendanceDate'],
                order: "attendanceDate DESC",
                limit: 8,
                attributes: [
                  'day',
                  'attendanceDate',
                  [
                    models.sequelize.fn('SUM', models.sequelize.col('count')),
                    'attendance'
                  ]
                ]
              }
            ).then(
              function(attendance) {
                callback(null, attendance);
              },
              function(err){
                console.log(err)
                callback(err);
              }
            );
          }
        ],
        function(error, result) {
          if (error) {
            let result = {
              error: err,
              record: null
            };
            reject(result);
            return null;
          } else {
            resolve(result);
            return null;
          }
        }
      );
    });
  },
  average() {
    return new Promise(function(resolve, reject){
      models.sequelize.query(
        `
          SELECT AVG(t1.attendance) as attendance
          FROM (
            SELECT SUM(count) as attendance FROM divisionClassAttendance GROUP BY attendanceDate
          ) as t1
        `,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(
        function(results) {
          resolve(results);
          return null;
        }
      );
    });
  },
  divisionClassAttendance() {
    return new Promise(function(resolve, reject){
      models.DivisionClassAttendance.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(attendance) {
          resolve(attendance);
        },
        function(err){
          let result = {
            error: err,
            record: null
          };
          reject(result);
        }
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.divisionClassId = new Buffer(record.divisionClassId, 'hex');
    return new Promise(function(resolve, reject){
      models.DivisionClassAttendance.create(
        record
      ).then(
        function(result) {
          resolve(result);
        },
        function(err){
          console.log(err);
          models.DivisionClassAttendance.findOne(
            {
                where: {
                  divisionClassId: record.divisionClassId,
                  day: 0,
                  attendanceDate: '2016-05-01 00:00:00'
                }
            }
          ).then(
            function(attendance) {
              let result = {
                error: err,
                record: attendance
              };
              reject(result);
            },
            function(err){
              let result = {
                error: err,
                record: null
              };
              reject(result);
            }
          );
        }
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      models.DivisionClassAttendance.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.DivisionClassAttendance.findOne({
            where: {
              id: record.id
            }
          }).then(
            function(result) {
              resolve(result);
            }
          );
        },
        function(err){
          let result = {
            error: err,
            record: null
          };
          reject(result);
        }
      );
    });
  },
  delete(record) {
    return new Promise(function(resolve, reject){
      models.DivisionClassAttendance.destroy({
        where: {
          id: new Buffer(record.id, 'hex')
        }
      }).then(
        function(results) {
          resolve(record);
        },
        function(err){
          let result = {
            error: err,
            record: null
          };
          reject(result);
        }
      );
    });
  }
};



