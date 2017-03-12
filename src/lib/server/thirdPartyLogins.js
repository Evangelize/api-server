import models from '../../models';
import people from './people';
import Promise from 'bluebird';
import iouuid from 'innodb-optimized-uuid';
import moment from 'moment-timezone';

export default {
  all() {
    return new Promise((resolve, reject) => {
      models.ThirdPartyLogins.findAll({
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  getPersonByType(peopleId, type) {
    return new Promise((resolve, reject) => {
      const newPeopleId = new Buffer(peopleId, 'hex');
      models.ThirdPartyLogins.findAll(
        {
          where: {
            peopleId: newPeopleId,
            type,
          },
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  get(type, externalId) {
    return new Promise((resolve, reject) => {
      models.ThirdPartyLogins.findAll(
        {
          where: {
            type,
            externalId,
          },
        }
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  insert(record) {
    return new Promise((resolve, reject) => {
      models.ThirdPartyLogins.create(
        record
      ).then(
        (result) => resolve(result),
        (err) => reject(err)
      );
    });
  },
  update(record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      const id = new Buffer(record.id, 'hex');
      models.ThirdPartyLogins.update(
        record,
        {
          where: {
            id,
          },
        }
      ).then(
        () => {
          models.ThirdPartyLogins.findOne({
            where: {
              id,
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
      models.ThirdPartyLogins.destroy({
        where: {
          id: new Buffer(record.id, 'hex'),
        },
      }).then(
        () => resolve(record),
        (err) => reject(err)
      );
    });
  },
  findPerson(first, last) {
    return people.fuzzySearch(
      first,
      last,
    );
  },
  addLoginRecord(type, externalId, firstName, lastName) {
    this.findPerson(
      firstName,
      lastName,
    )
    .then(
      (results) => {
        if (results.length) {
          const id = iouuid.generate().toLowerCase();
          const ts = moment.utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');
          this.insert({
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
    return new Promise((resolve, reject) => {
      this
      .get('google', id)
      .then(
        (results) => {
          if (results.length) {
            people.get(results[0].peopleId)
            .then(
              (result) => resolve(result),
              (err) => reject(err)
            );
          } else {
            return this.addLoginRecord(
              type,
              id,
              firstName,
              lastName,
            );
          }
        },
        (err) => reject(err)
      );
    });
  },
};
