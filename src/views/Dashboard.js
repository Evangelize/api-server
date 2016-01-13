import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
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
import { updateClassAttendance, updateNote, addNote, updateClassAttendanceLocal } from '../actions';
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
    const { dispatch, configs } = this.props;
    let db = spahql.db(configs.data),
        today = moment().weekday(),
        attendanceDay = db.select("/*/classMeetingDays/*[/day == "+today+"]").value();

    this.delayedAttendanceUpdate = _.debounce(function (divClass, count, event) {
      //console.log(divClass, event.target.value, attendanceDay);
      dispatch(updateClassAttendance(divClass.id, today, moment().format('YYYY-MM-DD 00:00:00'), count));
    }, 500);

    this.delayedNoteUpdate = _.debounce(function (note, changes) {
      dispatch(updateNote(note, changes));
    }, 500);


    this.setState({
      sparklineWidth: 100,
      attendanceDay: attendanceDay,
      displayAttendance: this.displayAttendance(),
      showDialog: false,
      currentNote: {
        id: null,
        title: null,
        text: null
      },
      masonryOptions: {}
    });
  }

  handleAttendanceUpdate() {
    let currentValue = select(store.getState());
    //console.log("handleAttendance", currentValue);
  }

  displayAttendance() {
    const { configs } = this.props;
    let db = spahql.db(configs.data),
        today = moment().weekday(),
        classDay = db.select("/*/classMeetingDays/*[/day == "+today+"]").value();
    if (!Array.isArray(classDay) && classDay !== null) {
      classDay = [classDay];
    } else if (classDay === null) {
      classDay = [];
    }
    let results = classDay.map(function(day, index){
      let config = db.select("/*[/id == "+day.divisionConfigId+"]"),
          classes = db.select("/*[/id == "+day.divisionConfigId+"]/divisionYears/0/divisions/0/divisionClasses");
      day.classes = classes.value();
      day.config = config.value();
    });
    return classDay;
  }

  getClasses(day) {
    const { configs } = this.props;
    let db = spahql.db(configs.data),
        today = moment().weekday();
    let classDays = db.select("/0/divisionYears/0/divisions/0/divisionClasses/*").values();
    return classDays;
  }

  displayTeachers(divClass) {
    const { configs } = this.props;
    let db = spahql.db(configs.data),
        today = moment().weekday(),
        teachers = db.select("/0/divisionYears/0/divisions/0/divisionClasses/*[/id =="+divClass.id+"]/divisionClassTeachers/*/[/day == "+today+"]").values();
    return teachers;
  }

  attendanceUpdate(divClass, e) {
    const { dispatch } = this.props,
          { attendanceDay } = this.state,
          db = spahql.db(divClass),
          attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ '^"+moment().format("YYYY-MM-DD")+"']"),
          exists = attendance.values.length,
          count = parseInt(e.target.value, 10);
    let attend = {},
        today = moment().format("YYYY-MM-DD")+"T00:00:00.000Z";
    e.persist();
    if (!exists) {
      attend = {
        attendanceDate: today,
        count: count,
        createdAt: today,
        day: moment().weekday(),
        deletedAt: null,
        divisionClassId: divClass.id,
        id: null,
        revision: null,
        updatedAt: today,
        updating: true
      }
      divClass.divisionClassAttendances.unshift(attend);
    } else {
      attendance.values[0].count = count;
      attendance.values[0].updating = true;
    }
    dispatch(updateClassAttendanceLocal(divClass));
    this.delayedAttendanceUpdate(divClass, count, e);
  }

  getClassAttendance(divClass) {
    let db = spahql.db(divClass),
        attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ '^"+moment().format("YYYY-MM-DD")+"']").values(),
        day = moment().format("YYYY-MM-DD"),
        isToday = false;
    console.log("getClassAttendance", divClass, attendance);
    if (attendance.length) {
      isToday = moment.utc(attendance[0].attendanceDate, "YYYY-MM-DDTHH:mm:ss.SSSZ").isSame(day, 'day');
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
    const { attendance } = this.props;
    let labels = attendance.data.latest.map(function(day, index){
          return moment(day.attendanceDate, "YYYY-MM-DD HH:mm:ss").format("MM/DD");
        }).reverse(),
        series = attendance.data.latest.map(function(day, index){
          return parseInt(day.attendance,10);
        }).reverse();
    //console.log("graphAttendance", labels, series);
    return {
      labels: labels,
      series: [series]
    };
  }

  isUpdating(divClass) {
    if (divClass.divisionClassAttendances.length && "updating" in divClass.divisionClassAttendances[0]) {
      console.log("isUpdating", true);
      return true;
    } else {
      console.log("isUpdating", false);
      return false;
    }
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
    const { dispatch, configs, attendance, notes, ...props } = this.props;
    const { masonryOptions, displayAttendance } = this.state;
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
        db = spahql.db(configs.data),
        today = moment().weekday(),
        classDay = db.select("/*/classMeetingDays/*[/day == "+today+"]").value()
    return (
      <div>
        <Grid fluid={true}>
          {displayAttendance.map((attendance, index) =>
            <Row key={attendance.id}>
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
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card>
                <CardHeader
                  title={"Teachers"}
                  subtitle={moment().isoWeekday(classDay.day).format("dddd")}
                  avatar={<Avatar>T</Avatar>}>
                </CardHeader>
                <CardMedia>
                  {::this.getClasses().map((divClass, index) =>
                    <div key={divClass.id}>
                      <Divider />
                      <List subheader={divClass.class.title}>
                        {this.displayTeachers(divClass).map((teacher, index) =>
                          <ListItem
                            key={teacher.id}
                            primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                            leftIcon={
                              <ActionGrade
                                onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}
                                color={(teacher.confirmed) ? Styles.Colors.deepOrange500 : Styles.Colors.grey400} />
                            }
                          />
                        )}
                      </List>
                    </div>
                  )}
                </CardMedia>
              </Card>
            </Col>
            <Col xs={6} sm={4} md={3} lg={3}>
              <DashboardComponentSmall
                zDepth={1}
                sparkLineData={[5, 10, 5, 20, 5, 30, 25, 10, 18, 32, 22, 28, 30, 21, 45, 29, 33, 18, 10, 15]}
                title={"Avg. Attendance"}
                body={attendance.data.average[0].attendance.toFixed(2)}
                style={paperStyle}
              />
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
                {notes.data.map((note, index) =>
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
  return {
    configs: state.divisionConfigs.present,
    attendance: state.attendance.present,
    notes: state.notes.present
  };
}

export default connect(select)(Dashboard);
