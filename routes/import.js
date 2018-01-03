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
const Minio = require('minio');
import stream from 'stream';
import http from 'http';
import settings from '../config';
const pushMessage = (message) => {
  utils.pushMessage(`import.${message.type}`, message);
};

const prefix = '/api';
const bucket = 'd38b1cc2d81511e69d1cbb4903068562';
const tenYears = 10 * 365 * 24 * 60 * 60;
let minioClient;
if (settings.s3) {
  minioClient = new Minio.Client({
    endPoint: settings.s3.endPoint,
    secure: settings.s3.secure,
    accessKey: settings.s3.accessKey,
    secretKey: settings.s3.secretKey,
  });
}

const uploadPhoto = (entity, prefix, cb) => {
  const sendFile = (data) => {
    const id = entity.id.toString('hex');
    const fileName = `${prefix}-${id}.jpg`;
    let url;
    minioClient.putObject(
      bucket,
      fileName,
      data,
      data.length,
      'image/jpeg',
      (error, etag) => {
        if (error) console.error(error);
        url = `https://${settings.s3.endPoint}/${bucket}/${fileName}`;
        cb(url);
      }
    );
  };

  http.request(
    entity.photoUrl,
    (response) => {
      const data = new stream.Transform();

      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const image = data.read();
        sendFile(image);
      });
    }
  ).end();
};

const importCsv = (req, reply) => {
  const fFieldMap = req.payload.families;
  const pFieldMap = req.payload.people;
  async.eachSeries(
    req.payload.data,
    (person, callback) => {
      let _person = {};
      let _family = {};

      fFieldMap.map((field) => (_family[field.id] = person[field.associated]));

      pFieldMap.map((field) => (_person[field.id] = person[field.associated]));

      _person.birthday = moment(_person.birthday, 'MM/DD/YYYY');
      _person.birthday = (_person.birthday.isValid()) ? _person.birthday.format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00');
      _person.nonChristian = (_person.nonChristian === 'Y') ? 1 : 0;
      _person.nonMember = (_person.nonMember === 'Y') ? 1 : 0;
      _person.collegeStudent = (_person.collegeStudent === 'Y') ? 1 : 0;
      _person.deceased = (_person.deceased === 'Y') ? 1 : 0;
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
                cb(err);
              }
            );
          },
          (family, cb) => {
            let add = false;
            const updateFamily = () => {
              if (add) {
                api.families.insert(
                  _family
                ).then(
                  (result) => {
                    cb(
                      null,
                      {
                        family: result.get({
                          plain: true,
                        }),
                      }
                    );
                  },
                  (err) => {
                    cb(err);
                  }
                );
              } else {
                api.families.update(
                  _family
                ).then(
                  (result) => {
                    cb(
                      null,
                      {
                        family: result.get({
                          plain: true,
                        }),
                      }
                    );
                  },
                  (err) => {
                    cb(err);
                  }
                );
              }
            };

            if (family) {
              _family = Object.assign(
                {},
                family.get({
                  plain: true,
                }),
                _family,
                {
                  id: new Buffer(family.id, 'hex'),
                }
              );
            } else {
              add = true;
              _family.id = iouuid.generate().toLowerCase();
            }
            if (minioClient && _family.photoUrl && _family.photoUrl.length > 0) {
              uploadPhoto(
                _family,
                'family',
                (url) => {
                  if (url) {
                    _family = Object.assign({},
                      _family,
                      {
                        photoUrl: url,
                      }
                    );
                  }
                  updateFamily(add);
                }
              );
            } else {
              updateFamily(add);
            }
          },
          (data, cb) => {
            let email = null;
            if (_person.emailAddress.length > 0) {
              email = _person.emailAddress;
            }
            api.people.fuzzySearch(
              _person.firstName,
              _person.lastName,
              email,
              _person.gender,
            ).then(
              (result) => {
                if (result.length) {
                  data.person = result[0];
                } else {
                  data.person = null;
                }
                cb(null, data);
              },
              (err) => {
                cb(err);
              }
            );
          },
          (data, cb) => {
            let add = false;
            const updatePerson = (add) => {
              if (add) {
                api.people.insert(
                  _person
                ).then(
                  (result) => {
                    cb(null, result);
                  },
                  (err) => {
                    cb(err);
                  }
                );
              } else {
                api.people.update(
                  _person
                ).then(
                  (result) => {
                    cb(null, result);
                  },
                  (err) => {
                    cb(err);
                  }
                );
              }
            };
            if (data.person) {
              _person = Object.assign(
                {},
                _person,
                {
                  id: new Buffer(data.person.id, 'hex'),
                  familyId: new Buffer(data.family.id, 'hex'),
                }
              );
            } else {
              add = true;
              _person = Object.assign({},
                _person,
                {
                  id: iouuid.generate().toLowerCase(),
                  familyId: data.family.id,
                }
              );
            }
            if (minioClient && _person.photoUrl && _person.photoUrl.length > 0) {
              uploadPhoto(
                _person,
                'person',
                (url) => {
                  if (url) {
                    _person = Object.assign({},
                      _person,
                      {
                        photoUrl: url,
                      }
                    );
                  }
                  updatePerson(add);
                }
              );
            } else {
              updatePerson(add);
            }
          },
        ],
        (error, result) => {
          if (!error) {
            const message = {
              type: 'info:import-update',
              collection: 'import-update',
              prior: null,
              record: result,
              error: null,
            };
            pushMessage(message);
          }
          callback(error);
        }
      );
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('import complete');
        const message = {
          type: 'info:import-complete',
          collection: 'import-complete',
          prior: null,
          record: null,
          error: null,
        };
        pushMessage(message);
      }
    }
  );
};

const updateBucketPolicy = (cb) => {
  minioClient.setBucketPolicy(
    bucket,
    '',
    Minio.Policy.READONLY,
    (err) => {
      if (err) {
        console.error(err);
      }
      cb(err);
    }
  );
}

module.exports = [
  {
    method: 'POST',
    path: `${prefix}/import`,
    handler: (req, reply) => {
      minioClient.bucketExists(
        bucket,
        (err) => {
          if (err && err.code === 'NoSuchBucket') {
            minioClient.makeBucket(
              bucket,
              'us-east-1',
              (error) => {
                if (error) {
                  console.error('Error creating bucket.', error);
                }
                updateBucketPolicy(() => importCsv(req, reply));
              }
            );
          } else {
            updateBucketPolicy(() => importCsv(req, reply));
          }
        }
      );
      //reply({ processing: true }).code(200);
      return { processing: true };
    },
  },
];
