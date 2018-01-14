import models from '../../models';
import people from './people';
import Promise from 'bluebird';
import iouuid from 'innodb-optimized-uuid';
import moment from 'moment-timezone';

export default {
  all(entityId, lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    if (entityId) {
      where.entityId = entityId;
    }
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
  findPerson(first, last, email) {
    return people.fuzzySearch(
      first,
      last,
      email,
    );
  },
  addLoginRecord(type, externalId, firstName, lastName, email) {
    return this.findPerson(
      firstName,
      lastName,
      email,
    )
    .then(
      (results) => {
        const id = iouuid.generate().toLowerCase();
        const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
        const peopleId = (results.length) ? results[0].id.toString('hex') : null;
        const entityId = (results.length) ? results[0].entityId.toString('hex') : null;
        return this.insert({
          id,
          peopleId,
          entityId,
          type,
          externalId,
          createdAt: ts,
          updatedAt: ts,
          deletedAt: null,
        }).then(
          () => this.search(type, externalId, firstName, lastName),
          (err) => Promise.reject(err)
        );
      }
    ).catch(
      (err) => Promise.reject(err)
    )
  },
  search(type, id, firstName, lastName) {
    return this
    .get('google', id)
    .then(
      (results) => {
        let retVal;
        if (results.length) {
          retVal = (results[0].peopleId) ? people.get(results[0].peopleId) : null;
        } else {
          retVal = this.addLoginRecord(
            type,
            id,
            firstName,
            lastName,
          );
        }
        return retVal;
      }
    );
  },
};
