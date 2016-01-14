var moment = require('moment-timezone'),
    startAy = 2016,
    divName = "Quarter",
    beginYear = 2015,
    beginYearMonth = 8,
    lengthDivision = 3,
    numDivisions = 12/lengthDivision,
    start = moment()
      .year(beginYear)
      .month(beginYearMonth)
      .startOf('month'),
    calculateFirstSunDiv = function(day) {
      var sunday = day.day('Sunday');
      if (sunday.date() > 7) {
        sunday.add(7,'d');
      }
      console.log(sunday.format("dddd, MMMM Do YYYY"));
    },
    calculateLastWedDiv = function(day) {
      var sunday = day.day('Sunday');
      if (sunday.date() > 7) {
        sunday.add(7,'d');
      }
      sunday.subtract(4, 'day');
      console.log(day.format("dddd, MMMM Do YYYY"));
      sunday.add(4, 'day')
    }

for (i=0; i < numDivisions; i++) {
  console.log(divName, i + 1, "-", "AY", startAy);
  calculateFirstSunDiv(start);
  start.add((lengthDivision),'month').startOf('month');
  calculateLastWedDiv(start);
  console.log("\n");
}
