var moment = require('moment-timezone'),
    beginYear = 2015,
    beginYearMonth = 8,
    lengthDivision = 3,
    currentQtr = 3,
    day = moment()
      .year(2015)
      .month(beginYearMonth + (lengthDivision*(currentQtr - 1)))
      .add(2, 'month')
      .endOf('month');

result = day;
while (result.day() !== 3) {
    result.subtract(1, 'day');
}
console.log(result.format());
