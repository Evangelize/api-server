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
            console.log(error);
            reject(error);
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
          console.log(err)
          reject(err);
        }
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    return new Promise(function(resolve, reject){
      models.DivisionClassAttendance.create(
        record
      ).then(
        function(result) {
          resolve(result);
        },
        function(err){
          console.log(err)
          reject(err);
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
          console.log(err)
          reject(err);
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
          console.log(err)
          reject(err);
        }
      );
    });
  }
};



