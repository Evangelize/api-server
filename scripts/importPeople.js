var _ = require('lodash'),
    moment = require('moment'),
    models  = require('../src/models'),
    fieldMap = {
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
    peopleData = require('../src/data/people.json');

peopleData.forEach(function(person, index){
  var _person = {};

  Object.keys(fieldMap).map(function(key) {
     _person[fieldMap[key]] = person[key];
  });

  _person.birthday = moment(_person.birthday, "MM/DD/YYYY").format("YYYY-MM-DD 00:00:00");

  models.People.create(
    _person
  ).then(
    function(person) {
      console.log(person);
    }
  )
});
