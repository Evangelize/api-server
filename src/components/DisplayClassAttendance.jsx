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
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-bootstrap';
import RenderClassAttendance from './RenderClassAttendance';

@connect
class DisplayClassAttendance extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }
  
  getClasses() {
    const { classes } = this.context.state;
    const { divisionConfig } = this.props,
          now  = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
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
    let results = classDay.map(function(day, index){
      day.classes = divClasses;
      day.config = divisionConfig;
    });
    console.log("classDay", classDay);
    return classDay;
  }

  render() {
    const { classes } = this.context.state;
    const { divisionConfig } = this.props;
    return (
      <div>
        {classes.getDivisionConfigClasses(divisionConfig.id).map((attendance, index) =>
          <Card key={attendance.id} style={(attendance) ? null : {display: 'none'}}>
            <CardHeader
                title={attendance.config.title+" Attendance"}
                subtitle={moment().format("dddd MM/DD/YYYY")}
                avatar={<Avatar>{moment().format("dd")}</Avatar>}>
            </CardHeader>
            <CardMedia>
              <Grid fluid={true} key={1}>
                <RenderClassAttendance divClasses={attendance.classes} />
              </Grid>
            </CardMedia>
          </Card>
        )}
      </div>
    );
  }
}
export default DisplayClassAttendance;
