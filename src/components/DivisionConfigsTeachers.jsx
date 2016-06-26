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
import DisplayTeachers from './DisplayTeachers';

@connect
class DivisionConfigsTeachers extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    const { classes } = this.context.state;
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      divisionConfigs: classes.getDivisionConfigs()
    });
  }
  
  display(divisionConfig) {
    const { classes } = this.context.state,
          { now } = this.state;
    //console.log("displayAttendance", classes);
    let today = moment().weekday(),
        division = classes.getCurrentDivision(now),
        classDay = classes.getCurrentDivisionMeetingDays(divisionConfig, today),
        divClasses = classes.getCurrentDivisionClasses(division.id);
    if (!Array.isArray(classDay) && classDay !== null) {
      classDay = [classDay];
    } else if (classDay === null) {
      classDay = [];
    }
    //console.log("classDay", classDay);
    return classDay;
  }
  
  render() {
    const { divisionConfigs } = this.state;
    return (
      <div>
        {divisionConfigs.map((divisionConfig, index) =>
          <Col xs={12} sm={12} md={6} lg={6} key={divisionConfig.id} style={(this.display(divisionConfig).length) ? null : {display: 'none'}}>
            <DisplayTeachers divisionConfig={divisionConfig} />
          </Col>
        )}
      </div>
    );
  }
}
export default DivisionConfigsTeachers;
