import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import DisplayTeacher from './DisplayTeacher';

@inject('classes')
@observer
class RenderTeachers extends Component {
  @observable teachers;
  componentWillMount() {
    const { divClass, day } = this.props;
    const { classes } = this.props;
    this.teachers = classes.getDivisionClassTeachersByDayRaw(divClass.id, day);
  }

  render() {
    const { divClass, day } = this.props;
    const { classes } = this.props;
    let retVal;
    if (divClass) {
      retVal = (
        <List>
          <Subheader>{classes.getClass(divClass.classId).title}</Subheader>
          {this.teachers.map((teacher) =>
            <DisplayTeacher teacher={teacher} key={teacher.id} />
          )}
        </List>
      );
    } else {
      retVal = <div />;
    }
    return retVal;
  }
}
export default RenderTeachers;
