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
  },
  divisionConfigs() {
    return new Promise(function(resolve, reject){
      models.DivisionConfigs.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  divisions() {
    return new Promise(function(resolve, reject){
      models.Divisions.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  divisionYears() {
    return new Promise(function(resolve, reject){
      models.DivisionYears.findAll(
        {
          order: "id ASC"
        }
      ).then(
        function(result) {
          resolve(result);
          return null;
        },
        function(err){
          console.log(err);
          reject(err);
          return null;
        }
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.Divisions.create(
        record
      ).then(
        (result) => {
          resolve(result);
          return null;
        },
        (err) => {
          const result = {
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
      let newrecord = Object.assign({}, record);
      newrecord.id = new Buffer(record.id, 'hex');
      models.Divisions.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.Divisions.findOne({
            where: {
              id: newrecord.id,
            },
          }).then(
            (result) => {
              resolve(result);
            }
          );
        },
        (err) => {
          const result = {
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
      models.Divisions.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => {
          resolve(record);
        },
        (error) => {
          const result = {
            error,
            record: null,
          };
          reject(result);
        }
      );
    });
  },
};



