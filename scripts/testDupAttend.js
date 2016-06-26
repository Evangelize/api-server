var models  = require('../src/models'),
    record = {
        id: "11e60fabc629a0e09db2bf68c7d0c2ae",
        divisionClassId: '32310000000000000000000000000000',
        day: 0,
        attendanceDate: '2016-05-01 00:00:00',
        count: '1'
    };


record.id = new Buffer(record.id, 'hex');
record.divisionClassId = new Buffer(record.divisionClassId, 'hex');

models.DivisionClassAttendance.create(
  record
).then(
  function(result) {
      console.log(result);
  },
  function(err){
    console.log(err);
    models.DivisionClassAttendance.findOne(
      {
          where: {
            divisionClassId: record.divisionClassId,
            day: 0,
            attendanceDate: '2016-05-01 00:00:00'
          }
      }
    ).then(
      function(attendance) {
        var result = {
          err: err,
          record: attendance
        };
        console.log(result);
      },
      function(err){
        console.log(err);
      }
    );
  }
);