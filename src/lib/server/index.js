import attendance from './attendance';
import classes from './classes';
import divisions from './divisions';
import divisionClasses from './divisionClasses';
import divisionClassTeachers from './divisionClassTeachers';
import divisionConfigs from './divisionConfigs';
import divisionYears from './divisionYears';
import notes from './notes';
import people from './people';
import students from './students';
import teachers from './teachers';
import users from './users';
import families from './families';
import yearMeetingDays from './yearMeetingDays';
import yearClassStudents from './yearClassStudents';

module.exports = {
  attendance,
  divisionClassAttendance: attendance,
  divisionClasses,
  divisionClassTeachers,
  divisionConfigs,
  divisionYears,
  classes,
  divisions,
  families,
  notes,
  people,
  students,
  teachers,
  users,
  yearMeetingDays,
  yearClassStudents,
};
