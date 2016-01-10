import React from 'react';

import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Dashboard from './views/Dashboard';
import People from './views/People';
import Schedules from './views/Schedules';
import Attendance from './views/Attendance';
import AddClassDayTeacher from './views/AddClassDayTeacher';
import EditDayAttendance from './views/EditDayAttendance';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard}/>
    <Route path="dashboard" component={Dashboard} />
    <Route path="people" component={People} />
    <Route path="schedules" component={Schedules} />
    <Route path="attendance" component={Attendance} />
    <Route path="attendance/:date" component={EditDayAttendance} />
    <Route path="schedule/:divisionConfigId/:yearId/:divisionId/:classId/:day" component={AddClassDayTeacher} />
  </Route>
);

export default routes;
