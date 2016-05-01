import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import People from './views/People';
import Schedules from './views/Schedules';
import Attendance from './views/Attendance';
import AddClassDayTeacher from './views/AddClassDayTeacher';
import EditDayAttendance from './views/EditDayAttendance';
import Classes from './views/Classes';
import Class from './views/Class';

export default (settings) => {
  console.log("createRoutes", settings.authenticated);
  const requireAuth = (nextState, replace, callback) => {
    console.log("authenticated", settings.authenticated);
    if (!settings.authenticated) {
      replace('/login');
    }
    callback();
  };
  const redirect = (nextState, replace, callback) => {
    console.log("authenticated", settings.authenticated);
    if (settings.authenticated) {
      replace('/dashboard');
    }
    callback();
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} onEnter={requireAuth} />
      <Route path="login" component={Login} onEnter={redirect} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
      <Route path="classes" component={Classes} onEnter={requireAuth} />
      <Route path="classes/:classId" component={Class} onEnter={requireAuth} />
      <Route path="people" component={People} onEnter={requireAuth} />
      <Route path="schedules" component={Schedules} onEnter={requireAuth} />
      <Route path="attendance" component={Attendance} onEnter={requireAuth} />
      <Route path="attendance/:date" component={EditDayAttendance} />
      <Route path="schedule/:divisionConfigId/:yearId/:classId/:day" component={AddClassDayTeacher} onEnter={requireAuth} />
    </Route>
  );
};
