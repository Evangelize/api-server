import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import spahql from 'spahql';
import MasonryCtl from 'react-masonry-component';
import Radium from 'radium';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import DashboardComponentSmall from '../components/DashboardComponentSmall';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
import ReactGridLayout from 'react-grid-layout';
import Paper from 'material-ui/lib/paper';
import Styles from 'material-ui/lib/styles';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import TextField from 'material-ui/lib/text-field';
import Avatar from 'material-ui/lib/avatar';
import Dialog from 'material-ui/lib/dialog';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import IconButton from 'material-ui/lib/icon-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Editor from 'react-medium-editor';
import { Grid, Row, Col } from 'react-bootstrap';
//import 'react-medium-editor/node_modules/medium-editor/dist/css/medium-editor.css';
//import 'react-medium-editor/node_modules/medium-editor/dist/css/themes/default.css';
import { updateClassAttendance, updateNote, addNote, divisionClassAttendanceAction } from '../actions';
let Masonry = MasonryCtl(React);

@Radium
class Dashboard extends Component {
  constructor(props) {
    super(props);
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
    const { dispatch, divisionConfigs, classMeetingDays } = this.props;
    let today = moment().weekday();

    this.delayedAttendanceUpdate = _.debounce(function (divClass, count, event) {
      //console.log(divClass, event.target.value, attendanceDay);
      dispatch(updateClassAttendance(divClass.id, today, moment().format('YYYY-MM-DD 00:00:00'), count));
    }, 500);

    this.delayedNoteUpdate = _.debounce(function (note, changes) {
      dispatch(updateNote(note, changes));
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
    const { classMeetingDays, divisions, classes, divisionClasses } = this.props,
          { now } = this.state;
    //console.log("displayAttendance", classes);
    let today = 0, //moment().weekday(),
        division = divisions.chain().find({'end': {'$gte': now}}).simplesort('end').limit(1).data()[0],
        classDay = classMeetingDays.find({
          '$and': [
            {
              'day': {
                '$eq': today
              }
            },
            {
              'divisionConfigId': {
                '$eq': divisionConfig.id
              }
            }
          ]
        }),
        divClasses = divisionClasses
                  .chain()
                  .find({'divisionId': {'$eq': division.id}})
                  .eqJoin(classes.data, 'classId', 'id', function (left, right) {
                    return {
                      class: right,
                      divisionClass: left
                    }
                  });
    if (!Array.isArray(classDay) && classDay !== null) {
      classDay = [classDay];
    } else if (classDay === null) {
      classDay = [];
    }
    let results = classDay.map(function(day, index){
      day.classes = divClasses.data();
      day.config = divisionConfig;
    });
    console.log("classDay", classDay);
    return classDay;
  }

  getClasses(divisionConfig) {
    const { classMeetingDays, divisions, classes, divisionClasses } = this.props,
          { now } = this.state;
    let today = moment().weekday(),
        division = divisions.chain().find({'end': {'$gte': now}}).simplesort('end').limit(1).data()[0],
        classDay = classMeetingDays.find({
          '$and': [
            {
              'day': {
                '$eq': today
              }
            },
            {
              'divisionConfigId': {
                '$eq': divisionConfig.id
              }
            }
          ]
        }),
        divClasses = divisionClasses
                  .chain()
                  .find({'divisionId': {'$eq': division.id}})
                  .eqJoin(classes.data, 'classId', 'id', function (left, right) {
                    return {
                      class: right,
                      divisionClass: left
                    }
                  });
    return divClasses.data();
  }

  displayTeachers(divClass) {
    const { divisionClassTeachers, people, divisionClasses } = this.props,
          { now } = this.state,
          classDay = divClass.class.day,
          divisionClassId = divClass.divisionClass.id;
    //console.log("divisionClassTeachers", divisionClassTeachers);
    let today = moment().weekday(),
        teachers = divisionClassTeachers
                  .chain()
                  .find(
                    {
                      '$and': [
                        {'divisionClassId': {'$eq': divisionClassId}},
                        {'classDay': {'$eq': classDay}}
                      ]
                    }
                  )
                  .eqJoin(people.data, 'peopleId', 'id', function (left, right) {
                    return {
                      person: right,
                      divClassTeacher: left
                    }
                  });
    return teachers.data();
  }

  attendanceUpdate(divClass, e) {
    const { dispatch, divisionClassAttendance } = this.props,
          { now } = this.state,
          oldObj = divisionClassAttendance.chain()
                      .find(
                        {
                          '$and': [
                            {
                              'attendanceDate': {'$gte': now}
                            },
                            {
                              'divisionClassId': {'$eq': divClass.id}
                            }
                          ]
                        }
                      ),
          exists = oldObj.data().length,
          count = parseInt(e.target.value, 10);
    let type = "insert",
        newObj = {},
        today = moment().format("YYYY-MM-DD")+"T00:00:00.000Z",
        ts = moment.utc().format("YYYY-MM-DDTHH:mm:ss.sssZ");
    e.persist();
    if (!exists) {
      newObj = {
        attendanceDate: now,
        count: count,
        createdAt: ts,
        day: moment().weekday(),
        deletedAt: null,
        divisionClassId: divClass.id,
        id: null,
        revision: null,
        updatedAt: ts
      };
    } else {
      type = "update";
      newObj.count = count;
    }
    dispatch(divisionClassAttendanceAction(type, oldObj, newObj));
    //this.delayedAttendanceUpdate(divClass, count, e);
  }

  getClassAttendance(divClass) {
    const { now } = this.state,
          { divisionClassAttendance } = this.props;
    let attendance = divisionClassAttendance.chain()
              .find(
                {
                  '$and': [
                    {
                      'attendanceDate': {'$gte': now}
                    },
                    {
                      'divisionClassId': {'$eq': divClass.id}
                    }
                  ]
                }
              )
              .data(),
        day = moment().format("YYYY-MM-DD"),
        isToday = false;
    //console.log("getClassAttendance", divClass, attendance);
    if (attendance.length) {
      isToday = moment.utc(attendance[0].attendanceDate).tz('America/Chicago').isSame(day, 'day');
      if (isToday) {
        return attendance[0].count.toString();
      } else {
        return "0";
      }
    } else {
      return "0";
    }
  }

  getGraphAttendance() {
    const { latestAttendance } = this.props;
    let labels = latestAttendance.map(function(day, index){
          return moment.utc(day.attendanceDate).tz("America/Chicago").format("MM/DD");
        }),
        series = latestAttendance.map(function(day, index){
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
    const { dispatch } = this.props;
    if (!this.state.currentNote.id) {
      let title = (this.refs.title.getValue().length) ? this.refs.title.getValue() : null;
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: this.state.currentNote.text,
          title: title
        }
      });
      dispatch(
        addNote(
          this.state.currentNote
        )
      );
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
    const { notes } = this.props;
    var results = notes.chain().find().simplesort('createdAt').data();
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

  handleNoteDelete(e) {
    e.stopPropagation();
    console.log("Delete", e);
  }

  highlightText(e) {
    if (e) {
      e.target.select();
    }
  }

  render() {
    const { dispatch, divisionConfigs, divisions, attendance, notes, classMeetingDays, avgAttendance, ...props } = this.props;
    const { masonryOptions, now } = this.state;
    let paperStyle = {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75px',
          backgroundColor: Styles.Colors.cyan300,
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
    return (
      <div>
        <Grid fluid={true}>
          {divisionConfigs.data.map((divisionConfig, index) =>
            <Row key={divisionConfig.id}>
            {this.displayAttendance(divisionConfig).map((attendance, index) =>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Card>
                    <CardHeader
                      title={attendance.config.title+" Attendance"}
                      subtitle={moment().format("dddd MM/DD/YYYY")}
                      avatar={<Avatar>{moment().format("dd")}</Avatar>}>
                    </CardHeader>
                    <CardMedia>
                      <Grid fluid={true}>
                        {attendance.classes.map((divClass, index) =>
                          <Col style={{display: "flex", alignItems: "center", justifyContent: "center"}} key={divClass.id} xs={12} sm={6} md={4} lg={3}>
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
                      </Grid>
                    </CardMedia>
                  </Card>
                </Col>
            )}
            </Row>
          )}
          <Masonry className={"row"} options={masonryOptions}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <DashboardMediumGraph
                title={"Attendance"}
                subtitle={"Past 8 weeks"}
                avatar={<Avatar>A</Avatar>}
                lineChartData={::this.getGraphAttendance()}
                lineChartOptions={lineChartOptions}
              />
            </Col>
            {divisionConfigs.data.map((divisionConfig, index) =>
              <Col xs={12} sm={12} md={6} lg={6} key={divisionConfig.id} style={(this.displayAttendance(divisionConfig).length) ? null : {display: 'none'}}>
                <Card>
                  <CardHeader
                    title={"Teachers"}
                    subtitle={moment().tz("America/Chicago").format("dddd")}
                    avatar={<Avatar>T</Avatar>}>
                  </CardHeader>
                  <CardMedia>
                    {::this.getClasses(divisionConfig).map((divClass, index) =>
                      <div key={divClass.id}>
                        <Divider />
                        <List subheader={divClass.class.title}>
                          {this.displayTeachers(divClass).map((teacher, index) =>
                            <ListItem
                              key={teacher.divClassTeacher.id}
                              primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                              leftIcon={
                                <ActionGrade
                                  onTouchTap={((...args)=>this.confirmTeacher(divClass, teacherDay, teacher, ...args))}
                                  color={(teacher.divClassTeacher.confirmed) ? Styles.Colors.deepOrange500 : Styles.Colors.grey400} />
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
              {classMeetingDays.find().map((day, index) =>
                <Col xs={12} sm={6} md={6} lg={6} key={day.id}>
                  <DashboardComponentSmall
                    zDepth={1}
                    sparkLineData={[5, 10, 5, 20, 5, 30, 25, 10, 18, 32, 22, 28, 30, 21, 45, 29, 33, 18, 10, 15]}
                    title={"Avg. Attendance "+moment().weekday(day.day).format("dddd")}
                    body={avgAttendance(day.day)}
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
                          onTouchTap={::this.handleNoteDelete}>
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

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired
};

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

function select(state) {
  //console.log("divisionConfigs", state.divisionConfigs);
  let latestAttendance = function() {
        let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(1, "month").valueOf(),
            latest = state.divisionClassAttendance.chain()
              .find({'attendanceDate': {'$gte': now}})
              .limit(8)
              .simplesort("attendanceDate")
              .data()
              .reduce(
                function(map, day){
                  map[day.attendanceDate] = (map[day.attendanceDate] || 0) + day.count;
                  return map;
                },
                Object.create(null)
              );
        return Object.keys(latest).map(function(k) { return {attendance: latest[k], attendanceDate: parseInt(k, 10)}; });
      };
  return {
    divisionConfigs: state.divisionConfigs,
    attendance: state.attendance,
    notes: state.notes,
    classMeetingDays: state.classMeetingDays,
    divisionClasses: state.divisionClasses,
    classes: state.classes,
    divisionClassAttendance: state.divisionClassAttendance,
    latestAttendance: latestAttendance(),
    divisions: state.divisions,
    divisionClassTeachers: state.divisionClassTeachers,
    people: state.people,
    avgAttendance: function(day) {
      day = day || 0;
      let now = moment.utc(moment.tz('America/Chicago').format('YYYY-MM-DD')).subtract(1, "month").valueOf();
      return state.divisionClassAttendance.chain()
        .find({'attendanceDate': {'$gte': now}})
        .mapReduce(
          function( obj ){
            return (obj.day === day) ? obj.count : null;
          },
          function ( array ){
            var cumulator = 0;
            var i = array.length >>> 0;
            var actual = 0;
            while(i--){
              if(array[i] !== null){
                cumulator += array[i];
                actual++;
              }
            }
            return ( cumulator / actual).toFixed(2);
          }
        );
    }
  };
}

export default connect(select)(Dashboard);
