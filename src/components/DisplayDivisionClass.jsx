import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import FlatButton from 'material-ui/FlatButton';
import {TableRow, TableRowColumn} from 'material-ui/Table';

@connect
class DisplayDivisionClass extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  handleEditDay(divClass, day, e) {
    let { divisionConfig, academicYear} = this.state,
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionClass.id + "/" + day.day.day;
    browserHistory.push(path);
  }
  
  renderClassTeachers() {
    const divClass = this.props.class;
    const { classes } = this.context.state;
    let division = classes.getDivision(divClass.divisionClass.divisionId),
        days = classes.getDivisionMeetingDays(division.divisionConfigId),
        classTeachers = [];
    //console.log(divClass);
    days.forEach(function(day, index){
      let results = classes.getDivisionClassTeachers(divClass.divisionClass.id, day.day);
      //console.log("teachers", day.day, results);
      if (results.length) {
        classTeachers.push({
          viewing: false,
          day: day,
          id: _.uniqueId(),
          teachers: results
        });
      } else {
        classTeachers.push({
          day: day,
          viewing: false,
          id: _.uniqueId(),
          teachers: [{
            'id': _.uniqueId(),
            'day': day.day,
            'divisionClassId': divClass.divisionClass.id,
            'peopleId': 0,
            'person': {
              'lastName': 'Assigned',
              'firstName': 'Not'
            },
            'divClassTeacher': {
              confirmed: false
            }
          }]
        });
      }
    });

    return classTeachers;
  }

  render() {
    const divisionClass = this.props.class,
          iconButtonElement = (
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left">
              <MoreVertIcon color={Colors.grey400} />
            </IconButton>
          );
    if(this.props.type === "table") {
      return (
        <TableRow selected={false}>
          <TableRowColumn>
            <h6><a style={{color: Colors.deepOrange500}} href="">{divisionClass.class.title}</a></h6>
            <p style={{color: Colors.grey600}}>{divisionClass.class.description}</p>
          </TableRowColumn>
          {::this.renderClassTeachers().map((teacherDay, index) =>
            <TableRowColumn key={teacherDay.id}>
              {teacherDay.teachers.map((teacher, index) =>
                <div key={index} style={{width: "100%", clear: "both"}}>
                  <IconButton
                    style={{
                      float: "left"
                    }}
                    touch={true}
                    onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}>
                  <ActionGrade
                    color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400} />
                  </IconButton>
                  <FlatButton
                    style={{
                      float: "left",
                      marginTop: "8px"
                    }}
                    label={teacher.person.firstName+" "+teacher.person.lastName}
                    secondary={true}
                    onTouchTap={(...args) =>this.handleEditDay(divisionClass, teacherDay, ...args)}
                    labelPosition="after" />
                </div>
              )}
            </TableRowColumn>
          )}
        </TableRow>
      );
    } else {
      return (
        <div>
          <Subheader>{divisionClass.class.title}</Subheader>
          {::this.renderClassTeachers().map((teacherDay, index) =>
            <ListItem
                key={teacherDay.id}
                primaryText={moment().isoWeekday(teacherDay.day.day).format("dddd")}
                initiallyOpen={false}
                primaryTogglesNestedList={true}
                rightIconButton={
                  <IconMenu
                    iconButtonElement={iconButtonElement}
                    onItemTouchTap={((...args)=>this.handleEditDay(divisionClass, teacherDay, ...args))}>
                    <MenuItem>Edit</MenuItem>
                  </IconMenu>
                }
                nestedItems={teacherDay.teachers.map((teacher, index) =>
                  <ListItem
                    key={index}
                    primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                    leftIcon={
                      <ActionGrade
                      onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}
                      color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400} />
                    } />,
                )}

            />
          )}
          <Divider />
        </div>
      );
    }
  }
}
export default DisplayDivisionClass;
