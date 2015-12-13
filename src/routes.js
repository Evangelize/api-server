import React from 'react';

import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Dashboard from './views/Dashboard';
import People from './views/People';
import Schedules from './views/Schedules';
import AddClassDayTeacher from './views/AddClassDayTeacher';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard}/>
    <Route path="dashboard" component={Dashboard} />
    <Route path="people" component={People} />
    <Route path="schedules" component={Schedules} />
    <Route path="schedule/:divisionConfigId/:yearId/:divisionId/:classId/:day" component={AddClassDayTeacher} />
  </Route>
);

export default routes;
