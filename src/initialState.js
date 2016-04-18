module.exports = function(){
  return {
    divisionConfigs: {
      data:[
        {
          id: 0,
          title: "Children",
          divisionYears: [
            {
              id: 0,
              start: "2015-01-01",
              end: "2015-12-31",
              divisions:[]
            }
          ],
          classMeetingDays: [

          ]
        }
      ],
      hydrated: false
    },
    people: {
      data: [],
      key: "lastName",
      filter: ""
    },
    notes: {},
    divisionClassAttendance: {},
    divisionClasses: {},
    divisionClassTeachers: {},
    classes: {},
    classMeetingDays: {},
    divisions : {},
    divisionYears : {},
    students : {},
    teachers : {}
  };
};
