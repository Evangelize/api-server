import models from '../../models';
import Promise from 'bluebird';

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
        },
        function(err){
          console.log(error);
          reject(error);
        }
      )
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
          } else {
            resolve(result);
          }
        }
      );
    });
  }
};
