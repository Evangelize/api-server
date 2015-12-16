import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  latest() {
    return new Promise(function(resolve, reject){
       async.waterfall(
        [
          function(callback) {
            console.log("Get Attendance");
            models.DivisionClassAttendance.findAll(
              {
                group: ['attendanceDate'],
                order: "attendanceDate DESC",
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
  }
};



