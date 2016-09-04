import models from '../../models';
import Promise from 'bluebird';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.YearClassStudents.findAll().then(
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
  get(id) {
    return new Promise((resolve, reject) => {
      const recordId = new Buffer(id, 'hex');
      models.YearClassStudents.findOne(
        {
          where: {
            id: recordId,
          },
        }
      ).then(
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
  insert(record) {
    let newrecord = Object.assign({}, record);
    newrecord.id = new Buffer(record.id, 'hex');
    newrecord.yearId = new Buffer(record.yearId, 'hex');
    newrecord.classId = new Buffer(record.classId, 'hex');
    newrecord.peopleId = new Buffer(record.peopleId, 'hex');
    return new Promise((resolve, reject) => {
      models.YearClassStudents.create(
        newrecord
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
      newrecord.yearId = new Buffer(record.yearId, 'hex');
      newrecord.classId = new Buffer(record.classId, 'hex');
      newrecord.peopleId = new Buffer(record.peopleId, 'hex');
      models.YearClassStudents.update(
        newrecord,
        {
          where: {
            id: newrecord.id,
          },
        }
      ).then(
        () => {
          models.YearClassStudents.findOne({
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
      models.YearClassStudents.destroy({
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
