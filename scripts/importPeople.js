var _ = require('lodash'),
  moment = require('moment-timezone'),
  models = require('../src/models'),
  async = require('async'),
  iouuid = require('innodb-optimized-uuid'),
  pFieldMap = {
    "id": "id",
    "Last Name": "lastName",
    "First Name": "firstName",
    "Family Position (S=Spouse, C=Child)": "familyPosition",
    "Gender (M=Male, F=Female)": "gender",
    "Home Phone Number (###-###-####)": "homePhoneNumber",
    "Work Phone Number (###-###-####)": "workPhoneNumber",
    "Cell Phone Number  (###-###-####)": "cellPhoneNumber",
    "Email Address": "emailAddress",
    "Birthday (MM/DD/YYYY)": "birthday",
    "Non-Christian (Optional; Y=Yes, N=No)": "nonChristian",
    "Non-Member (Y=Yes, N=No)": "nonMember",
    "Membership Status (F=Former Member)": "membershipStatus",
    "College Student (Y=Yes, N=No)": "collegeStudent",
    "Individual Photo URL (http://www...)": "photoUrl",
  },
  fFieldMap = {
    "Address": "address1",
    "Suite, Apt Number, etc. (Optional)": "address2",
    "City": "city",
    "State (XX)": "state",
    "ZIP Code": "zipCode",
    "Last Name": "name",
    "Family Name": "familyName",
    "Family Photo URL (http://www...)": "photoUrl",
  },
  peopleData = require('../src/data/people.json');

async.eachSeries(
  peopleData,
  function(person, callback) {
    var _person = {},
      _family = {};

    Object.keys(fFieldMap).map(function(key) {
      _family[fFieldMap[key]] = person[key];
    });

    Object.keys(pFieldMap).map(function(key) {
      _person[pFieldMap[key]] = person[key];
    });

    _person.birthday = moment(_person.birthday, "MM/DD/YYYY");
    _person.birthday = (_person.birthday.isValid()) ? _person.birthday.format("YYYY-MM-DD 00:00:00") : moment().format("YYYY-MM-DD 00:00:00");
    _person.nonChristian = (_person.nonChristian === 'Y') ? 1 : 0;
    _person.nonMember = (_person.nonMember === 'Y') ? 1 : 0;
    _person.collegeStudent = (_person.collegeStudent === 'Y') ? 1 : 0;
    async.waterfall(
      [
        function(cb) {
          models.Families.find({
            where: {
              name: _family.name,
              familyName: _family.familyName,
            },
          }).then(
            function(family) {
              cb(null, family);
            },
            function(err) {
              console.log(err);
              cb(err);
            }
          );
        },
        function(family, cb) {
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
              function(family) {
                cb(null, {
                  family: family.get({
                    plain: true,
                  }),
                });
              }
            );
          }
        },
        function(data, cb) {
          var where = {};
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
            where: where,
          }).then(
            function(person) {
              data.person = person;
              cb(null, data);
            },
            function(err) {
              console.log(err);
              cb(err);
            }
          );
        },
        function(data, cb) {
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
              function(person) {
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
              function(person) {
                cb(person);
              }
            );
          }
        },
      ],
      function(error, result) {
        console.log(result);
        callback();
      }
    );


  },
  function(err) {

  }
);