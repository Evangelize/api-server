import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import spahql from 'spahql';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardTitle from 'material-ui/Card/CardTitle';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import Styles from 'material-ui/styles';
import {List, ListItem, ListDivider} from 'material-ui/List';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-bootstrap';

@connect(state => ({
  classes: state.classes
}))
@observer
class EditDayAttendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    console.log("EditDayAttendance:componentWillMount");
    const { classes, params } = this.props;
    console.log("date", params.date);
    this.setState({
      now: parseInt(params.date, 10)
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps);
  }

  componentDidMount() {

  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  displayAttendance(divisionConfig) {
    const { classes, params } = this.props,
          { now } = this.state;
    //console.log("displayAttendance", classes);
    let today = moment(params.date, "x").weekday(),
        division = classes.getCurrentDivision(params.date),
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
    //console.log("classDay", classDay);
    return classDay;
  }

  attendanceUpdate(divClass, e) {
    const { classes } = this.props,
          { now } = this.state;
    classes.updateClassAttendance(divClass.divisionClass.id, now, e.target.value);
  }

  getClassAttendance(divClass) {
    const { classes, params } = this.props,
          { now } = this.state;
    let attendance = classes.collections.divisionClassAttendance.chain()
              .find(
                {
                  $and: [
                    {
                      attendanceDate: now
                    },
                    {
                      divisionClassId: {$eq: divClass.divisionClass.id}
                    },
                    {
                      deletedAt: null
                    }
                  ]
                }
              )
              .data(),
        day = moment(params.date, "x").format("YYYY-MM-DD"),
        isToday = false;
    //console.log("getClassAttendance", divClass, attendance);
    if (attendance.length) {
      /*
      isToday = moment.utc(attendance[0].attendanceDate).tz('America/Chicago').isSame(day, 'day');
      if (isToday) {
        return attendance[0].count.toString();
      } else {
        return "0";
      }
      */
      return attendance[0].count.toString();
    } else {
      return "0";
    }
  }

  navigate(path, e) {
    browserHistory.push(path);
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
      e.target.select();
    }
  }

  render() {
    const { params, classes, ...props } = this.props;
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div style={{margin: "0 0.5em"}}>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/attendance", ...args))} className={"breadcrumb"}>Attendance</a>
                    <a className={"breadcrumb"}>Edit</a>
                  </div>
                </div>
              </nav>
            </Col>
          </Row>
          {classes.getDivisionConfigs().map((divisionConfig, index) =>
            <Row key={index}>
            {this.displayAttendance(divisionConfig).map((attendance, index) =>
                <Col xs={12} sm={12} md={12} lg={12} key={index}>
                  <Card>
                    <CardHeader
                      title={attendance.config.title+" Attendance"}
                      subtitle={moment(params.date, "x").format("dddd MM/DD/YYYY")}
                      avatar={<Avatar>{moment(params.date, "x").format("dd")}</Avatar>}>
                    </CardHeader>
                    <CardMedia>
                      <Grid fluid={true} key={1}>
                        <Row>
                        {attendance.classes.map((divClass, index) =>
                          <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}} key={index} xs={12} sm={6} md={4} lg={3}>
                            <div style={{width: "85%"}}>
                              <TextField
                                type="number"
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
                        )}
                        </Row>
                      </Grid>
                    </CardMedia>
                  </Card>
                </Col>
            )}
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

export default EditDayAttendance;
