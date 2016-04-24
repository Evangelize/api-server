import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import MasonryCtl from 'react-masonry-component';
import Radium from 'radium';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import DashboardComponentSmall from '../components/DashboardComponentSmall';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
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
import { updateClassAttendance, updateNote, addNote, divisionClassAttendanceAction } from '../actions';
let Masonry = MasonryCtl(React);

@connect(state => ({
  classes: state.classes,
  settings: state.settings
}))
@observer
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
    const { classes, settings } = this.props;
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
    const { classes } = this.props,
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
    const { classes } = this.props,
          { now } = this.state;
    let today = moment().weekday(),
        division = classes.getCurrentDivision(now),
        classDay = classes.getCurrentDivisionMeetingDays(divisionConfig, today),
        divClasses = classes.getCurrentDivisionClasses(division.id);
    return divClasses;
  }

  displayTeachers(divClass) {
    const { classes } = this.props,
          { now } = this.state,
          classDay = divClass.class.day,
          divisionClassId = divClass.divisionClass.id;
    let today = moment().weekday(),
        teachers = classes.getCurrentClassTeachers(divisionClassId);
    return teachers;
  }

  attendanceUpdate(divClass, e) {
    const { classes } = this.props,
          { now } = this.state;
    classes.updateClassAttendance(divClass.divisionClass.id, now, parseInt(e.target.value, 10));
  }

  getClassAttendance(divClass) {
    const { now } = this.state,
          { classes } = this.props;
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
    const { classes } = this.props;
    let labels = classes.latestAttendance(day, length).map(function(day, index){
          return moment.utc(day.attendanceDate).tz("America/Chicago").format("MM/DD");
        }),
        series = classes.latestAttendance(day, length).map(function(day, index){
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

  handleCardTouchTap(note, e) {
    this.setState({
      currentNote: note,
      showDialog: true
    });
  }

  handleDialogClose(e) {
    if (!this.state.currentNote.id) {
      let title = (this.refs.title.getValue().length) ? this.refs.title.getValue() : null;
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: this.state.currentNote.text,
          title: title
        }
      });
      /*
      dispatch(
        addNote(
          this.state.currentNote
        )
      );
      */
    }
    this.setState({
      showDialog: false
    });
  }

  handleEditorChange(text) {
    if (this.state.currentNote.id) {
      this.delayedNoteUpdate(this.state.currentNote, {text: text});
    } else {
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: text,
          title: this.state.currentNote.title
        }
      });
    }
  }

  handleTitleChange(e) {
    let title = (this.refs.title.getValue().length) ? this.refs.title.getValue() : null;
    if (this.state.currentNote.id) {
      this.delayedNoteUpdate(this.state.currentNote, {title: title});
    } else {
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: this.state.currentNote.text,
          title: title
        }
      });
    }
  }

  getNotes() {
    const { classes } = this.props;
    let results = classes.getNotes();
    return results;
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

  handleNoteDelete(note, e) {
    e.stopPropagation();
    const { classes } = this.props;
    classes.deleteRecord("notes", note.id);
  }

  highlightText(e) {
    if (e) {
      e.target.select();
    }
  }

  render() {
    const { classes, ...props } = this.props;
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
        customActions = [
          <FlatButton
            key={0}
            label="Done"
            primary={true}
            onTouchTap={::this.handleDialogClose} />
        ],
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
          {classes.getDivisionConfigs().map((divisionConfig, index) =>
            <Row key={index}>
            {this.displayAttendance(divisionConfig).map((attendance, index) =>
                <Col xs={12} sm={12} md={12} lg={12} key={index}>
                  <Card>
                    <CardHeader
                      title={attendance.config.title+" Attendance"}
                      subtitle={moment().format("dddd MM/DD/YYYY")}
                      avatar={<Avatar>{moment().format("dd")}</Avatar>}>
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
              <Col xs={12} sm={12} md={6} lg={6} key={index} style={(this.displayAttendance(divisionConfig).length) ? null : {display: 'none'}}>
                <Card>
                  <CardHeader
                    title={divisionConfig.title + " Teachers"}
                    subtitle={moment().tz("America/Chicago").format("dddd")}
                    avatar={<Avatar>T</Avatar>}>
                  </CardHeader>
                  <CardMedia>
                    {::this.getClasses(divisionConfig).map((divClass, index) =>
                      <div key={index}>
                        <Divider />
                        <List>
                          <Subheader>{divClass.class.title}</Subheader>
                          {this.displayTeachers(divClass).map((teacher, index) =>
                            <ListItem
                              key={teacher.divClassTeacher.id}
                              primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                              leftIcon={
                                <ActionGrade
                                  onTouchTap={((...args)=>this.confirmTeacher(divClass, teacherDay, teacher, ...args))}
                                  color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400} />
                              }
                            />
                          )}
                        </List>
                      </div>
                    )}
                  </CardMedia>
                </Card>
              </Col>
            )}
            <Col xs={12} sm={12} md={6} lg={6}>
              {classes.getClassMeetingDays().map((day, index) =>
                <Col xs={12} sm={6} md={6} lg={6} key={index}>
                  <DashboardComponentSmall
                    zDepth={1}
                    sparkLineData={[5, 10, 5, 20, 5, 30, 25, 10, 18, 32, 22, 28, 30, 21, 45, 29, 33, 18, 10, 15]}
                    title={"Avg. Attendance "+moment().weekday(day.day).format("dddd")}
                    body={classes.avgAttendance(day.day)}
                    style={paperStyle}
                  />
                </Col>
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
                    primary={true}
                    onTouchTap={::this.handleNewNote}
                  />
                </ToolbarGroup>
              </Toolbar>
              <Masonry>
                {this.getNotes().map((note, index) =>
                  <Col key={note.id} xs={12} sm={6} md={6} lg={6} key={index}>
                    <Card>
                      <CardTitle title={note.title} style={(note.title) ? null : {display: 'none'}} />
                      <CardText onClick={((...args)=>this.handleCardTouchTap(note, ...args))}>
                        <div dangerouslySetInnerHTML={{__html: note.text}} />
                      </CardText>
                      <CardActions style={{float: "right"}}>
                        <IconButton
                          iconClassName="material-icons"
                          tooltipPosition="top-center"
                          tooltip="Delete"
                          onTouchTap={((...args)=>this.handleNoteDelete(note, ...args))}>
                            delete
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Col>
                )}
              </Masonry>
            </Col>
          </Masonry>
        </Grid>
        <Dialog
          title={
            <TextField
              style={{margin: "25px"}}
              ref="title"
              hintText="Title"
              onChange={::this.handleTitleChange}
              defaultValue={this.state.currentNote.title} />
          }
          actions={customActions}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.showDialog}
          onRequestClose={::this.handleDialogClose}>
          <Editor
            className="editor"
            ref="editor"
            text={this.state.currentNote.text}
            onChange={::this.handleEditorChange}
            options={{toolbar: {buttons: ['bold', 'italic', 'underline', 'unorderedlist']}}}
          />
        </Dialog>
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
