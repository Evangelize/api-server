import React, { Component, PropTypes } from 'react';
import { uniqueId } from 'lodash/fp';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import * as Colors from 'material-ui/styles/colors';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import Promise from 'bluebird';
import Async from './Async';

@inject('classes')
@observer
class DisplayDivisionClass extends Component {
  @observable division;
  @observable divisionYear;

  componentWillMount() {
    const now = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    const { classes, divisionClass } = this.props;
    this.division = classes.getDivision(divisionClass.divisionId);
    this.divisionYear = classes.getCurrentDivisionYear(this.division.divisionConfigId);
  }

  handleEditDay(divClass, day, e) {
    const path = `/schedule/${this.division.divisionConfigId}/${this.divisionYear.id}/${divClass.id}/${day.dow}`;
    browserHistory.push(path);
  }

  renderTeachersList(day) {
    const { classes, divisionClass } = this.props;
    const teachers = classes.getDivisionClassTeachersByDayRaw(divisionClass.id, parseInt(day.dow, 10));
    const arTeachers = [];

    classes.getTeachers(teachers).map((teacher) => {
      arTeachers.push(
        <ListItem
          key={teacher.id}
          primaryText={`${teacher.firstName} ${teacher.lastName}`}
          leftIcon={
            <ActionGrade
              onClick={((...args) => this.confirmTeacher(divisionClass, day, teacher, ...args))}
              color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400}
            />
          }
        />
      );
    });

    return arTeachers;
  }

  renderTeachersTable(day) {
    const { classes, divisionClass } = this.props;
    const teachers = classes.getDivisionClassTeachersByDayRaw(divisionClass.id, parseInt(day.dow, 10));
    const arTeachers = [];

    if (teachers.length) {
      teachers.map((teacher) => {
        arTeachers.push(
          <div key={teacher.id} style={{ width: '100%', clear: 'both' }}>
            <IconButton
              style={{
                float: 'left',
              }}
              touch
              onClick={((...args) => this.confirmTeacher(divisionClass, day, teacher, ...args))}
            >
              <ActionGrade
                color={(teacher.confirmed) ? Colors.deepOrange500 : Colors.grey400}
              />
            </IconButton>
            <FlatButton
              style={{
                float: 'left',
                marginTop: '8px',
              }}
              label={`${classes.getPerson(teacher.peopleId).firstName} ${classes.getPerson(teacher.peopleId).lastName}`}
              secondary
              onClick={(...args) => this.handleEditDay(divisionClass, day, ...args)}
              labelPosition="after"
            />
          </div>
        );
      });
    } else {
      arTeachers.push(
        <div key={0} style={{ width: '100%', clear: 'both' }}>
          <IconButton
            style={{
              float: 'left',
            }}
            touch
          >
            <ActionGrade
              color={Colors.grey400}
            />
          </IconButton>
          <FlatButton
            style={{
              float: 'left',
              marginTop: '8px',
            }}
            label={`No Teachers Assigned`}
            secondary
            onClick={(...args) => this.handleEditDay(divisionClass, day, ...args)}
            labelPosition="after"
          />
        </div>
      );
    }

    return arTeachers;
  }

  render() {
    const { classes, divisionClass, meetingDays, type } = this.props;
    const iconButtonElement = (
      <IconButton
        touch
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={Colors.grey400} />
      </IconButton>
    );
    if (type === 'table') {
      return (
        <TableRow selected={false}>
          <TableRowColumn>
            <h6><a style={{ color: Colors.deepOrange500 }} href="">{divisionClass.class.title}</a></h6>
            <p style={{ color: Colors.grey600 }}>{divisionClass.class.description}</p>
          </TableRowColumn>
          {meetingDays.map((day) =>
            <TableRowColumn key={day.id}>
              {this.renderTeachersTable(day)}
            </TableRowColumn>
          )}
        </TableRow>
      );
    } else {
      return (
        <div>
          <Subheader>{divisionClass.class.title}</Subheader>
            {meetingDays.map((day) =>
              <ListItem
                key={day.id}
                primaryText={moment().isoWeekday(day.dow).format('dddd')}
                initiallyOpen={false}
                primaryTogglesNestedList
                rightIconButton={
                  <IconMenu
                    iconButtonElement={iconButtonElement}
                    onItemTouchTap={((...args) => this.handleEditDay(divisionClass, day, ...args))}
                  >
                    <MenuItem>Edit</MenuItem>
                  </IconMenu>
                }
                nestedItems={this.renderTeachersList(day)}
              />
            )}
          <Divider />
        </div>
      );
    }
  }
}
export default DisplayDivisionClass;
