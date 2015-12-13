var moment = require('moment'),
    sunday = moment()
      .year(2016)
      .month(2)
      .startOf('month')
      .day("Sunday");

if (sunday.date() > 7) {
  sunday.add(7,'d');
}
var month = sunday.month();
console.log(sunday.toString());
