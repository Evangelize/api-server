import models from '../../models';
import Promise from 'bluebird';

export default {
  get(id) {
    return new Promise((resolve, reject) => {
      models.People.findOne(
        {
          where: {
            id: new Buffer(id, 'hex'),
          },
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  find(field, term) {
    return new Promise((resolve, reject) => {
      models.People.findAll({
        where: models.sequelize.where(models.sequelize.col(field), 'LIKE', `${term}%`),
        include: [
          {
            model: models.Teachers,
          },
          {
            model: models.Students,
          },
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  fuzzySearch(first, last, email, gender) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT * 
        FROM people 
        WHERE 
      `;
      let nameQuery;
      if (first) {
        nameQuery = `(SOUNDEX(firstName) LIKE CONCAT('%',SOUNDEX('${first}'),'%')`;
      }
      if (last) {
        nameQuery = (nameQuery) ? `${nameQuery} AND` : nameQuery;
        nameQuery = `${nameQuery} SOUNDEX(lastName) LIKE CONCAT('%',SOUNDEX('${last}'),'%')`;
      }
      if (nameQuery) {
        nameQuery = `${nameQuery})`;
      }
      if (email) {
        nameQuery = (nameQuery) ? `${nameQuery} AND` : nameQuery;
        nameQuery = `${nameQuery} emailAddress LIKE CONCAT('%','${email}','%')`;
      }
      if (gender) {
        nameQuery = (nameQuery) ? `${nameQuery} AND` : nameQuery;
        nameQuery = `${nameQuery} gender = '${gender}'`;
      }
      query = `${query} ${nameQuery}`;
      models.sequelize.query(
        query,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  all() {
    return new Promise((resolve, reject) => {
      models.People.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
    record.familyId = (record.familyId) ? new Buffer(record.familyId, 'hex') : null;
    record.cohortId = (record.cohortId) ? new Buffer(record.cohortId, 'hex') : null;
    return new Promise((resolve, reject) => {
      models.People.create(
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
      record.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
      record.familyid = (record.familyId) ? new Buffer(record.familyId, 'hex') : null;
      record.cohortId = (record.cohortId) ? new Buffer(record.cohortId, 'hex') : null;
      models.People.update(
        record,
        {
          where: {
            id: record.id,
          },
        }
      ).then(
        () => {
          models.People.findOne({
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
      models.People.destroy({
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
