import Joi from 'joi';
import _ from 'lodash';
import moment from 'moment-timezone';
import async from 'async';
import iouuid from 'innodb-optimized-uuid';
import api from '../src/lib/server';
import models from '../src/models';
import utils from '../src/lib/utils';
import fs from 'fs';
import path from 'path';
import settings from '../config/settings.json';
const prefix = '/api';

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/import`,
    handler: (request, reply) => {
      const fFieldMap = request.payload.families;
      const pFieldMap = request.payload.people;
      console.log(request.payload);
      async.eachSeries(
        request.payload.data,
        (person, callback) => {
          let _person = {};
          let _family = {};

          fFieldMap.map((field) => {
            _family[field.id] = person[field.associated];
          });

          pFieldMap.map((field) => {
            _person[field.id] = person[field.associated];
          });

          _person.birthday = moment(_person.birthday, 'MM/DD/YYYY');
          _person.birthday = (_person.birthday.isValid()) ? _person.birthday.format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00');
          _person.nonChristian = (_person.nonChristian === 'Y') ? 1 : 0;
          _person.nonMember = (_person.nonMember === 'Y') ? 1 : 0;
          _person.collegeStudent = (_person.collegeStudent === 'Y') ? 1 : 0;
          async.waterfall(
            [
              (cb) => {
                models.Families.find({
                  where: {
                    name: _family.name,
                    address1: _family.address1,
                  },
                }).then(
                  (family) => {
                    cb(null, family);
                  },
                  (err) => {
                    console.log(err);
                    cb(err);
                  }
                );
              },
              (family, cb) => {
                if (family) {
                  cb(null, {
                    family: family.get({
                      plain: true,
                    }),
                  });
                } else {
                  _family.id = iouuid.generate().toLowerCase();
                  models.Families.create(
                    _family
                  ).then(
                    (family) => {
                      cb(null, {
                        family: family.get({
                          plain: true,
                        }),
                      });
                    }
                  );
                }
              },
              (data, cb) => {
                let where = {};
                if (_person.emailAddress.length > 0) {
                  where = {
                    $or: [{
                      emailAddress: _person.emailAddress,
                    },
                    {
                      lastName: _person.lastName,
                      firstName: _person.firstName,
                    }],
                  };
                } else {
                  where = {
                    lastName: _person.lastName,
                    firstName: _person.firstName,
                  };
                }
                models.People.find({
                  where,
                }).then(
                  (person) => {
                    data.person = person;
                    cb(null, data);
                  },
                  (err) => {
                    console.log(err);
                    cb(err);
                  }
                );
              },
              (data, cb) => {
                if (data.person) {
                  console.log('family', data.family);
                  _person = Object.assign({},
                    _person, {
                      id: new Buffer(data.person.id, 'hex'),
                      familyId: new Buffer(data.family.id, 'hex'),
                    }
                  );
                  console.log('_person', _person);
                  models.People.update(
                    _person, {
                      where: {
                        id: _person.id,
                      },
                    }
                  ).then(
                    (person) => {
                      cb(null, person);
                    }
                  );
                } else {
                  _person = Object.assign({},
                    _person, {
                      id: iouuid.generate().toLowerCase(),
                      familyId: data.family.id,
                    }
                  );
                  models.People.create(
                    _person
                  ).then(
                    (person) => {
                      cb(person);
                    }
                  );
                }
              },
            ],
            (error, result) => {
              console.log(result);
              callback();
            }
          );
        },
        (err) => {
          const payload = {
            success: (err) ? false : true,
          };
          const code = (err) ? 400 : 200;
          reply(payload).code(code);
        }
      );
    },
  },
];
