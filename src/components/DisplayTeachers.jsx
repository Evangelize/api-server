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
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class DisplayTeachers extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      classes: this.getClasses()
    });
  }
  
  getClasses() {
    const { classes } = this.context.state;
    const { divisionConfig } = this.props,
           now = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    let today = moment().weekday(),
        division = classes.getCurrentDivision(now),
        classDay = classes.getCurrentDivisionMeetingDays(divisionConfig, today),
        divClasses = classes.getCurrentDivisionClasses(division.id);
    return divClasses;
  }

  displayTeachers(divClass) {
    const { classes } = this.context.state,
          { now } = this.state,
          classDay = divClass.class.day,
          divisionClassId = divClass.divisionClass.id;
    let today = moment().weekday(),
        teachers = classes.getCurrentClassTeachers(divisionClassId);
    return teachers;
  }

  render() {
    const { divisionConfig } = this.props;
    const { classes } = this.state;
    return (
      <Card>
        <CardHeader
        title={divisionConfig.title + " Teachers"}
        subtitle={moment().tz("America/Chicago").format("dddd")}
        avatar={<Avatar>T</Avatar>}>
        </CardHeader>
        <CardMedia>
        {classes.map((divClass, index) =>
            <div key={index}>
            <Divider />
            <List>
                <Subheader>{divClass.class.title}</Subheader>
                {this.displayTeachers(divClass).map((teacher, index) =>
                <ListItem
                    key={teacher.divClassTeacher.id}
                    primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                    leftAvatar={
                    <Avatar 
                        src={
                        (teacher.person.individualPhotoUrl) ? 
                            teacher.person.individualPhotoUrl : 
                            teacher.person.familyPhotoUrl
                        }
                        >
                        {
                            (teacher.person.individualPhotoUrl || teacher.person.familyPhotoUrl) ? 
                            null : 
                            teacher.person.firstName.charAt(0)
                        }
                        </Avatar>
                    }
                />
                )}
            </List>
            </div>
        )}
        </CardMedia>
      </Card>
    );
  }
}
export default DisplayTeachers;
