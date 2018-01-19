import Promise from 'bluebird';
import iouuid from 'innodb-optimized-uuid';
import moment from 'moment-timezone';
import models from '../../models';
import people from './people';
import { getUser } from '../firebase-admin';

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
  getById(id) {
    id = new Buffer(id, 'hex');
    return models.ThirdPartyLogins.find(
      {
        where: {
          id,
        },
      }
    );
  },
  insert(record) {
    return models.ThirdPartyLogins.create(
      record
    );
  },
  connectLogin(peopleId, entityId, loginId) {
    const self = this;
    return this.getById(loginId).then(
      (data) => {
        const record = Object.assign(
          {},
          data.get(),
          {
            peopleId,
            entityId,
          }
        );
        return self.update(record);
      }
    );
  },
  async getPersonLogins(id) {
    const peopleId = new Buffer(id, 'hex');
    const getEUser = async (login) => {
      let person;
      try {
        person = await getUser(login.externalId);
      } catch (e) {
        console.log(e);
        person = null;
      }
      const retVal = Object.assign(
        {},
        login.get(),
        {
          person,
        },
      );
      return retVal;
    };
    try {
      const logins = await models.ThirdPartyLogins.findAll(
        {
          where: {
            peopleId,
          },
        }
      );
      const data = await Promise.map(logins, getEUser);
      return data;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  getUnconnectedLogins() {
    const getEUser = (login) => {
      return getUser(login.externalId).then(
        (person) => {
          console.log(person);
          const retVal = Object.assign(
            {},
            login.get(),
            {
              person,
            },
          );

          return retVal;
        } 
      );
    };

    return models.ThirdPartyLogins.findAll(
      {
        where: {
          peopleId: null,
        },
      }
    ).then(
      (logins) => {
        return Promise.map(logins, getEUser);
      }
    );
  },
  update(record) {
    console.log(record);
    record.id = new Buffer(record.id, 'hex');
    record.entityId = record.entityId ? new Buffer(record.entityId, 'hex') : null;
    record.peopleId = record.peopleId ? new Buffer(record.peopleId, 'hex') : null;
    return models.ThirdPartyLogins.update(
      record,
      {
        where: {
          id: record.id,
        },
      }
    ).then(
      () => models.ThirdPartyLogins.findOne({
        where: {
          id: record.id,
        },
      })
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
    return people.fuzzySearch(
      firstName,
      lastName,
      email,
    ).then(
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
    );
  },
  async search(type, id, firstName, lastName, email) {
    let retVal;
    const login = await this.get('google', id);
    if (login.length) {
      retVal = (login[0].peopleId) ? await people.get(login[0].peopleId) : null;
    } else {
      retVal = this.addLoginRecord(
        type,
        id,
        firstName,
        lastName,
        email
      );
    }

    if (!retVal && login.length) {
      const person = await people.fuzzySearch(
        firstName,
        lastName,
        email,
      );

      if (person.length) {
        const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
        const peopleId = (person.length) ? person[0].id.toString('hex') : null;
        const entityId = (person.length) ? person[0].entityId.toString('hex') : null;
        const newRecord = Object.assign(
          login[0].get(),
          {
            peopleId,
            entityId,
            updatedAt: ts,
          }
        );
        await this.update(newRecord);
        retVal = await people.get(newRecord.peopleId);
      }
    }

    return retVal;
  },
};
