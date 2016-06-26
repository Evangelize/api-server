import models from '../../models';
import Promise from 'bluebird';
import async from 'async';

export default {
  get() {
    return new Promise(function(resolve, reject){
      models.Notes.findAll({
        order: [
          ['updatedAt', 'DESC']
        ]
      }).then(
        function(results) {
          resolve(results);
          return null;
        },
        function(err){
          console.log(error);
          reject(error);
          return null;
        }
      )
    });
  },
  add(note) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.Notes.create(
              note
            ).then(
              function(note) {
                callback(null, note);
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
  updateNote(noteId, fields) {
    return new Promise(function(resolve, reject){
      async.waterfall(
        [
          function(callback) {
            models.Notes.findOne(
              {
                where: {
                  id: noteId
                }
              }
            ).then(
              function(note, created) {
                callback(null, note);
              },
              function(err){
                callback(err);
              }
            );
          },
          function(note, callback) {
            note.update(
              fields
            ).then(
              function(note, created) {
                callback(null, note);
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
  notes() {
    return new Promise(function(resolve, reject){
      models.Notes.findAll(
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
    return new Promise(function(resolve, reject){
      models.Notes.create(
        record
      ).then(
        function(result) {
          resolve(result);
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
   update(record) {
    console.log(record);
    return new Promise(function(resolve, reject){
      record.id = new Buffer(record.id, 'hex');
      models.Notes.update(
        record,
        {
          where: {
            id: record.id
          }
        }
      ).then(
        function(rows) {
          models.Notes.findOne({
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
      models.Notes.destroy({
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
