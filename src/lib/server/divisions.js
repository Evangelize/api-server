import models from '../../models';
import async from 'async';
import Promise from 'bluebird';

export default {
  getDivisionConfigs() {
    return new Promise(function(resolve, reject){
       async.waterfall(
        [
          function(callback) {
            models.DivisionConfigs.findAll({
              include: [
                {
                  model: models.DivisionYears,
                  include: [
                    {
                      model: models.Divisions,
                      separate: true,
                      order: [
                        models.sequelize.literal('(end < CURDATE()) ASC'),
                        models.sequelize.literal('(greatest(end, CURDATE())) ASC'),
                        models.sequelize.literal('(least(end, CURDATE())) DESC')
                      ],
                      include: [
                        {
                          model: models.DivisionClasses,
                          separate: true,
                          order: "classId ASC",
                          include: [
                            {
                              model: models.Classes
                            },
                            {
                              model: models.DivisionClassTeachers,
                              separate: true,
                              order: "day ASC",
                              include: [
                                {
                                  model: models.People
                                }
                              ]
                            },
                            {
                              model: models.DivisionClassAttendance,
                              separate: true,
                              order: "attendanceDate DESC"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  model: models.ClassMeetingDays
                }
              ]
            }).then(
              function(configs) {
                callback(null, configs);
              },
              function(err){
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
  }
};



