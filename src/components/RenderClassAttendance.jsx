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

@connect
class RenderClassAttendance extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }
  
  
  attendanceUpdate(divClass, e) {
    const { classes } = this.context.state,
          { now } = this.state;
    classes.updateClassAttendance(divClass.divisionClass.id, now, parseInt(e.target.value, 10));
  }

  getClassAttendance(divClass) {
    const { now } = this.state,
          { classes } = this.context.state;
    let attendance = classes.getClassAttendanceToday(divClass.divisionClass.id),
        day = moment().format("YYYY-MM-DD"),
        isToday = false;
    //console.log("getClassAttendance", divClass, attendance);
    if (attendance.length && attendance[0].count) {
      /*
      isToday = moment.utc(attendance[0].attendanceDate).tz('America/Chicago').isSame(day, 'day');
      if (isToday) {
        let count = (attendance[0].count === null) ? "0" : attendance[0].count.toString();
        return count;
      } else {
        return "0";
      }
      */
      return attendance[0].count.toString();
    } else {
      return "0";
    }
  }


  isUpdating(divClass) {
    /*
    if (divClass.divisionClassAttendances.length && "updating" in divClass.divisionClassAttendances[0]) {
      console.log("isUpdating", true);
      return true;
    } else {
      console.log("isUpdating", false);
      return false;
    }
    */
    return false;
  }
  
  highlightText(e) {
    if (e) {
      e.target.setSelectionRange(0, 9999);
    }
  }

  render() {
    const { divClass } = this.props;
    console.log(divClass);
    return (

      <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}} key={divClass.id} xs={12} sm={6} md={4} lg={3}>
        <div style={{width: "85%"}}>
            <TextField
                type="tel"
                hintText="Enter attendance"
                value={::this.getClassAttendance(divClass)}
                min="0"
                max="500"
                ref={"inputAttendance"+divClass.id}
                onFocus={((...args)=>this.highlightText(...args))}
                onChange={((...args)=>this.attendanceUpdate(divClass, ...args))}
                floatingLabelText={divClass.class.title} />
        </div>
        <div style={{width: "13%", margin: "0 1%", height: "50px", overflow: "hidden"}}><CircularProgress style={{display: (this.isUpdating(divClass)) ? "block" : "none"}} size={0.35} mode="indeterminate" /></div>
      </Col>
            
    );
  }
}
export default RenderClassAttendance;
