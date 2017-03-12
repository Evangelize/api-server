import models from '../../models';
import Promise from 'bluebird';
import async from 'async';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.Notes.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      )
    });
  },
  add(note) {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.Notes.create(
              note
            ).then(
              (result) => callback(null, result),
              (err) => callback(err),
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
  updateNote(noteId, fields) {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (callback) => {
            models.Notes.findOne(
              {
                where: {
                  id: noteId,
                },
              }
            ).then(
              (note) => callback(null, note),
              (err) => callback(err)
            );
          },
          (note, callback) => {
            note.update(
              fields
            ).then(
              (result) => callback(null, result),
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
  notes() {
    return new Promise((resolve, reject) => {
      models.Notes.findAll(
        {
          order: 'id ASC',
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.Notes.create(
        record
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    return new Promise((resolve, reject) => {
      record.id = new Buffer(record.id, 'hex');
      models.Notes.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.Notes.findOne({
            where: {
              id: record.id,
            },
          }).then(
            (result) => resolve(result),
            (err) => reject(err)
          );
        },
        (err) => reject(err)
      );
    });
  },
  delete(record) {
    return new Promise((resolve, reject) => {
      models.Notes.destroy({
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
