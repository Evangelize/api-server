import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import DisplayTeacher from './DisplayTeacher';
import Async from './Async';

@inject('classes')
@observer
class RenderTeachers extends Component {
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
    });
  }

  render() {
    const { divClass, day } = this.props;
    const { classes } = this.props;
    return (
      <Async
        pendingRender={<div />}
        promise={classes.getDivisionClassTeachersByDay(divClass.id, day)}
        then={(teachers) =>
          <List>
            <Subheader>{classes.getClass(divClass.classId).title}</Subheader>
            {teachers.resultset.map((teacher) =>
              <DisplayTeacher teacher={teacher} key={teacher.id} />
            )}
          </List>
        }
      />
    );
  }
}
export default RenderTeachers;
