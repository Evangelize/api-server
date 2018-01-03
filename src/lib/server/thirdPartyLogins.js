import models from '../../models';
import people from './people';
import Promise from 'bluebird';
import iouuid from 'innodb-optimized-uuid';
import moment from 'moment-timezone';

export default {
  all(lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    return models.ThirdPartyLogins.findAll({
      where,
      order: [
        ['updatedAt', 'DESC'],
      ],
    });
  },
  getPersonByType(peopleId, type) {
    const newPeopleId = new Buffer(peopleId, 'hex');
    return models.ThirdPartyLogins.findAll(
      {
        where: {
          peopleId: newPeopleId,
          type,
        },
      }
    );
  },
  get(type, externalId) {
    return models.ThirdPartyLogins.findAll(
      {
        where: {
          type,
          externalId,
        },
      }
    );
  },
  insert(record) {
    return models.ThirdPartyLogins.create(
      record
    );
  },
  update(record) {
    console.log(record);
    const id = new Buffer(record.id, 'hex');
    return models.ThirdPartyLogins.update(
      record,
      {
        where: {
          id,
        },
      }
    ).then(
      () => {
        return models.ThirdPartyLogins.findOne({
          where: {
            id,
          },
        });
      }
    );
  },
  delete(record) {
    return models.ThirdPartyLogins.destroy({
      where: {
        id: new Buffer(record.id, 'hex'),
      },
    });
  },
  findPerson(first, last) {
    return people.fuzzySearch(
      first,
      last,
    );
  },
  addLoginRecord(type, externalId, firstName, lastName) {
    return this.findPerson(
      firstName,
      lastName,
    )
    .then(
      (results) => {
        if (results.length) {
          const id = iouuid.generate().toLowerCase();
          const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
          return this.insert({
            id,
            peopleId: results[0].id.toString('hex'),
            type,
            externalId,
            createdAt: ts,
            updatedAt: ts,
            deletedAt: null,
          })
          .then(
            () => this.search(type, externalId, firstName, lastName),
            (err) => Promise.reject(err)
          );
        } else {
          return Promise.reject({
            success: false,
            reason: 'No user could be found',
          });
        }
      },
      (err) => Promise.reject(err)
    );
  },
  search(type, id, firstName, lastName) {
    return this
    .get('google', id)
    .then(
      (results) => {
        if (results.length) {
          return people.get(results[0].peopleId)
          .then(
            (result) => Promise.resolve(result),
            (err) => Promise.reject(err)
          );
        } else {
          return this.addLoginRecord(
            type,
            id,
            firstName,
            lastName,
          );
        }
      }
    );
  },
};
