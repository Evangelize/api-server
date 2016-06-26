var _ = require('lodash'),
    moment = require('moment-timezone'),
    models  = require('../src/models'),
    async = require('async'),
    pFieldMap = {
      "id": "id",
      "Family Name": "familyName",
      "Last Name": "lastName",
      "First Name": "firstName",
      "Family Position (S=Spouse, C=Child)": "familyPosition",
      "Gender (M=Male, F=Female)": "gender",
      "Address": "address1",
      "Suite, Apt Number, etc. (Optional)": "address2",
      "City": "city",
      "State (XX)": "state",
      "ZIP Code": "zipCode",
      "Home Phone Number (###-###-####)": "homePhoneNumber",
      "Work Phone Number (###-###-####)": "workPhoneNumber",
      "Cell Phone Number  (###-###-####)": "cellPhoneNumber",
      "Email Address": "emailAddress",
      "Birthday (MM/DD/YYYY)": "birthday",
      "Non-Christian (Optional; Y=Yes, N=No)": "nonChristian",
      "Non-Member (Y=Yes, N=No)": "nonMember",
      "Membership Status (F=Former Member)": "membershipStatus",
      "College Student (Y=Yes, N=No)": "collegeStudent",
      "Individual Photo URL (http://www...)": "individualPhotoUrl",
      "Family Photo URL (http://www...)": "familyPhotoUrl"
    },
    fFieldMap = {
      "Family Name": "familyName",
      "Family Photo URL (http://www...)": "familyPhotoUrl"
    },
    peopleData = require('../src/data/people.json');

async.each(
  peopleData,
  function(person, callback){
    var _person = {},
        _family = {};
    
    Object.keys(fFieldMap).map(function(key) {
      _family[fFieldMap[key]] = person[key];
    });

    Object.keys(pFieldMap).map(function(key) {
      _person[pFieldMap[key]] = person[key];
    });

    _person.birthday = moment(_person.birthday, "MM/DD/YYYY").format("YYYY-MM-DD 00:00:00");

    async.waterfall(
      [
        function(cb) {
          models.Families.find(

          );
        },
        function(person, cb) {
          if (person) {
            person.update(
              _person
            ).then(
              function(person) {
                cb(person);
              }
            );
          } else {
            models.People.create(
              _person
            ).then(
              function(person) {
                cb(person);
              }
            );
          }
        }
      ],
      function(error, result) {
        console.log(result);
        callback();
      }
    )

    
  }, 
  function(err){

  }
);
