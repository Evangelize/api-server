import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import AddFamilyMember from './views/members/AddFamilyMember';
import Dashboard from './views/Dashboard';
import Families from './views/members/Families';
import Family from './views/members/Family';
import Login from './views/Login';
import Member from './views/members/Member';
import AddMember from './views/members/AddMember';
import Members from './views/members/Members';
import ImportMembers from './views/members/ImportMembers';
import Schedules from './views/classes/Schedules';
import Attendance from './views/classes/Attendance';
import AddClassDayTeacher from './views/classes/AddClassDayTeacher';
import AddClassStudents from './views/classes/AddClassStudents';
import EditDayAttendance from './views/classes/EditDayAttendance';
import EditWorshipAttendance from './views/worship/EditWorshipAttendance';
import Classes from './views/classes/Classes';
import Class from './views/classes/Class';
import ClassGroupings from './views/classes/ClassGroupings';
import ClassGroupingAcademicYears from './views/classes/ClassGroupingAcademicYears';
import AcademicYearDivisions from './views/classes/AcademicYearDivisions';
import DivisionClasses from './views/classes/DivisionClasses';
import DivisionClassesSelect from './views/classes/DivisionClassesSelect';
import MeetingDaysSelect from './views/classes/MeetingDaysSelect';
import WorshipServices from './views/worship/WorshipServices';
import WorshipAttendance from './views/worship/WorshipAttendance';
import WorshipJobsSelect from './views/worship/WorshipJobsSelect';
import Jobs from './views/worship/Jobs';
import JobMembers from './views/worship/JobMembers';
import AssignJobs from './views/worship/AssignJobs';

export default (auth) => {
  const requireAuth = (nextState, replace, callback) => {
    if (!auth.authenticated) {
      replace('/login');
    }
    callback();
  };
  const redirect = (nextState, replace, callback) => {
    if (auth.authenticated) {
      replace('/dashboard');
    }
    callback();
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} onEnter={requireAuth} />
      <Route
        path="login"
        exact
        component={Login}
        onEnter={redirect}
      />
      <Route
        path="dashboard"
        component={Dashboard}
        onEnter={requireAuth}
      />
      <Route
        path="classes"
        component={Classes}
        onEnter={requireAuth}
      />
      <Route
        path="classes/:classId"
        component={Class}
        onEnter={requireAuth}
      />
      <Route
        path="classes/:classId/:yearId/students"
        component={AddClassStudents}
        onEnter={requireAuth}
      />
      <Route
        path="members/search"
        component={Members}
        onEnter={requireAuth}
      />
      <Route
        path="members/import"
        component={ImportMembers}
        onEnter={requireAuth}
      />
      <Route
        path="members/person/:id"
        component={Member}
        onEnter={requireAuth}
      />
      <Route
        path="members/add/person"
        component={AddMember}
        onEnter={requireAuth}
      />
      <Route
        path="members/add/family"
        component={Family}
        onEnter={requireAuth}
      />
      <Route
        path="members/families"
        component={Families}
        onEnter={requireAuth}
      />
      <Route
        path="members/family/:id"
        component={Family}
        onEnter={requireAuth}
      />
      <Route
        path="members/family/:id/add"
        component={AddFamilyMember}
        onEnter={requireAuth}
      />
      <Route
        path="schedules"
        component={Schedules}
        onEnter={requireAuth}
      />
      <Route
        path="attendance"
        component={Attendance}
        onEnter={requireAuth}
      />
      <Route
        path="attendance/:divisionConfig/:date"
        component={EditDayAttendance}
      />
      <Route
        path="schedule/:divisionConfigId/:yearId/:classId/:day"
        component={AddClassDayTeacher}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/manage"
        component={ClassGroupings}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/:classGroupingId"
        component={ClassGroupingAcademicYears}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/academicYear/:yearId"
        component={AcademicYearDivisions}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/academicYear/:yearId/meetingDays"
        component={MeetingDaysSelect}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/academicYearDivision/:divisionId"
        component={DivisionClasses}
        onEnter={requireAuth}
      />
      <Route
        path="schedule/academicYearDivision/:divisionId/select"
        component={DivisionClassesSelect}
        onEnter={requireAuth}
      />
      <Route
        path="worship/services/list"
        component={WorshipServices}
        onEnter={requireAuth}
      />
      <Route
        path="worship/services/:id/jobs"
        component={WorshipJobsSelect}
        onEnter={requireAuth}
      />
      <Route
        path="worship/jobs/list"
        component={Jobs}
        onEnter={requireAuth}
      />
      <Route
        path="worship/jobs/:id/members"
        component={JobMembers}
        onEnter={requireAuth}
      />
      <Route
        path="worship/assign"
        component={AssignJobs}
        onEnter={requireAuth}
      />
      <Route
        path="worship/attendance"
        exact
        component={WorshipAttendance}
        onEnter={requireAuth}
      />
      <Route
        path="worship/attendance/:date/:id"
        exact
        component={EditWorshipAttendance}
        onEnter={requireAuth}
      />
    </Route>
  );
};
