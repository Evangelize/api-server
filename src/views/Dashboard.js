import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import Masonry from 'react-masonry-component';
import Radium from 'radium';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardComponentSmall from '../components/DashboardComponentSmall';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
import DisplayClassAttendance from '../components/DisplayClassAttendance';
import DisplayTeachers from '../components/DisplayTeachers';
import DivisionConfigsAttendance from '../components/DivisionConfigsAttendance';
import DisplayNotes from '../components/DisplayNotes';
import ReactGridLayout from 'react-grid-layout';
import Paper from 'material-ui/Paper';
import * as Colors from 'material-ui/styles/colors';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardTitle from 'material-ui/Card/CardTitle';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Editor from 'react-medium-editor';
import { Grid, Row, Col } from 'react-bootstrap';

//import 'react-medium-editor/node_modules/medium-editor/dist/css/medium-editor.css';
//import 'react-medium-editor/node_modules/medium-editor/dist/css/themes/default.css';
//let Masonry = MasonryCtl(React);

@connect
class Dashboard extends Component {
  constructor(props, context){
    super(props, context);
    //this.attendanceUpdate = _.debounce(this.attendanceUpdate, 2000);
  }

  resize() {
    _.throttle(() => {
      const { masonryOptions } = this.state;
      const graphDiv = this.refs.graphDiv;
      //console.log(graphDiv.clientWidth);
      masonryOptions.updated = true;
      this.setState({
          sparklineWidth: graphDiv.offsetWidth - 40
      });
    }, 30)
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps", nextProps);
  }

  componentWillMount() {
    const { classes, settings } = this.context.state;
    let today = moment().weekday();
    settings.authenticated = true;

    this.delayedAttendanceUpdate = _.debounce(function (divClass, count, event) {
      //console.log(divClass, event.target.value, attendanceDay);
      classes.updateClassAttendance(divClass.id, today, moment().format('YYYY-MM-DD 00:00:00'), count);
    }, 500);

    this.delayedNoteUpdate = _.debounce(function (note, changes) {
      //dispatch(updateNote(note, changes));
    }, 500);


    this.setState({
      sparklineWidth: 100,
      showDialog: false,
      currentNote: {
        id: null,
        title: null,
        text: null
      },
      masonryOptions: {},
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  handleAttendanceUpdate() {
    let currentValue = select(store.getState());
    //console.log("handleAttendance", currentValue);
  }

  displayAttendance(divisionConfig) {
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
    let results = classDay.map(function(day, index){
      day.classes = divClasses;
      day.config = divisionConfig;
    });
    //console.log("classDay", classDay);
    return classDay;
  }

  getClasses(divisionConfig) {
    const { classes } = this.context.state,
          { now } = this.state;
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
    if (attendance.length) {
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

  getGraphAttendance(day, length) {
    const { classes } = this.context.state;
    let attendance = classes.latestAttendance(day, length),
        labels = attendance.map(function(day, index){
          return moment.utc(day.attendanceDate).tz("America/Chicago").format("MM/DD");
        }),
        series = attendance.map(function(day, index){
          return parseInt(day.attendance,10);
        });
    //console.log("graphAttendance", labels, series);
    return {
      labels: labels,
      series: [series]
    };
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

  handleNewNote(e) {
    this.setState({
      currentNote: {
        id: null,
        title: null,
        text: null
      },
      showDialog: true
    });
  }


  highlightText(e) {
    if (e) {
      e.target.select();
    }
  }

  render() {
    const { classes } = this.context.state;
    const { masonryOptions, now } = this.state;
    let paperStyle = {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75px',
          backgroundColor: Colors.cyan300,
          color: 'white'
        },
        grid = {
          className: "layout",
          isDraggable: false,
          isResizable: false,
          cols: 12,
          rowHeight: 50
        },
        lineChartOptions = {
          low: 0,
          showArea: true
        },
        halogenContainer = {
          height: "25px",
          width: "25px"
        },
        halogen = {
          color: '#4DAF7C',
          size: '8px'
        },
        today = moment().weekday();
    //console.log("classes.divisionConfigs:", classes);
    return (
      <div>
        <Grid fluid={true}>
          <DivisionConfigsAttendance style={(classes.isClassDay()) ? null : {display: 'none'}}/>
          <Masonry className={"row"} options={masonryOptions}>
            {classes.getClassMeetingDays().map((day, index) =>
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <DashboardMediumGraph
                  title={moment().weekday(day.day).format("dddd") + " Attendance"}
                  subtitle={"Past 8 weeks"}
                  avatar={<Avatar>A</Avatar>}
                  lineChartData={::this.getGraphAttendance(day.day, 8)}
                  lineChartOptions={lineChartOptions}
                />
              </Col>
            )}
            {classes.getDivisionConfigs().map((divisionConfig, index) =>
              <Col xs={12} sm={12} md={6} lg={6} key={divisionConfig.id} style={(this.displayAttendance(divisionConfig).length) ? null : {display: 'none'}}>
                <DisplayTeachers divisionConfig={divisionConfig} />
              </Col>
            )}
            <Col xs={12} sm={12} md={6} lg={6}>
              {classes.getClassMeetingDays().map((day, index) =>
                <div key={day.id}>
                <Col xs={12} sm={6} md={6} lg={6} key={index}>
                  <DashboardComponentSmall
                    zDepth={1}
                    title={"Avg. Attendance "+moment().weekday(day.day).format("dddd")}
                    body={classes.avgAttendance(day.day)}
                    style={paperStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6} key={"pc"+index}>
                  <DashboardComponentSmall
                    zDepth={1}
                    title={"Attendance Change "+moment().weekday(day.day).format("dddd")}
                    body={classes.attendancePercentChange(day.day)}
                    style={paperStyle}
                  />
                </Col>
                </div>
              )}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Toolbar>
                <ToolbarGroup key={0} float="left">
                  <ToolbarTitle text="Notes" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <RaisedButton
                    label="Add Note"
                    secondary={true}
                    onTouchTap={::this.handleNewNote}
                  />
                </ToolbarGroup>
              </Toolbar>
              <DisplayNotes />
            </Col>
            
          </Masonry>
        </Grid>
        
      </div>
    );
  }
}

const styles = {
  noteSmall: {
    width: '48%',
    paddingRight: '2%',
    paddingBottom: '1.5em',
    '@media (max-width: 839px)': {
      paddingRight: '0',
      width: '100%'
    }
  },
  smallCell: {
    width: '31%',
    padding:'1% 2% 1% 0',
    '@media (min-width: 480px)': {
      padding: '0',
      width: '%'
    }
  }
};

export default Dashboard;
