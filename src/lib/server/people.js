import models from '../../models';
import Promise from 'bluebird';

export default {
  get(id) {
    return models.People.findOne(
      {
        where: {
          id: new Buffer(id, 'hex'),
        },
      }
    );
  },
  find(field, term) {
    return models.People.findAll({
      where: models.sequelize.where(models.sequelize.col(field), 'LIKE', `${term}%`),
      include: [
        {
          model: models.Teachers,
        },
        {
          model: models.Students,
        },
      ],
    });
  },
  fuzzySearch(first, last, email, gender) {
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
      nameQuery = (nameQuery) ? `${nameQuery} OR` : nameQuery;
      nameQuery = `${nameQuery} emailAddress LIKE CONCAT('%','${email}','%')`;
    }
    if (gender) {
      nameQuery = (nameQuery) ? `${nameQuery} OR` : nameQuery;
      nameQuery = `${nameQuery} gender = '${gender}'`;
    }
    query = `${query} ${nameQuery}`;
    return models.sequelize.query(
      query,
      {
        type: models.sequelize.QueryTypes.SELECT,
      }
    );
  },
  all(entityId, lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    if (entityId) {
      where.entityId = entityId;
    }
    return new Promise((resolve, reject) => {
      models.People.findAll({
        where,
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
    return models.People.create(
      record
    );
  },
  update(record) {
    record.id = new Buffer(record.id, 'hex');
    record.entityId = (record.entityId) ? new Buffer(record.entityId, 'hex') : null;
    record.familyid = (record.familyId) ? new Buffer(record.familyId, 'hex') : null;
    record.cohortId = (record.cohortId) ? new Buffer(record.cohortId, 'hex') : null;
    return models.People.update(
      record,
      {
        where: {
          id: record.id,
        },
      }
    ).then(
      () => {
        return models.People.findOne({
          where: {
            id: record.id,
          },
        })
      }
    );
  },
  delete(record) {
    return models.People.destroy({
      where: {
        id: new Buffer(record.id, 'hex'),
      },
    });
  },
};
