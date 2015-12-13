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
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import Avatar from 'material-ui/lib/avatar';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import Editor from 'react-medium-editor';
//import 'react-medium-editor/node_modules/medium-editor/dist/css/medium-editor.css';
//import 'react-medium-editor/node_modules/medium-editor/dist/css/themes/default.css';
import { updateClassAttendance } from '../actions';
let Masonry = MasonryCtl(React);

@Radium
class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  resize() {
    _.throttle(() => {
      const graphDiv = this.refs.graphDiv;
      console.log(graphDiv.clientWidth);
      this.setState({
          sparklineWidth: graphDiv.offsetWidth - 40
      });
    }, 30)
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillMount() {
    const { dispatch, configs } = this.props;
    let db = spahql.db(configs.data),
        today = moment().weekday(),
        attendanceDay = db.select("/*/classMeetingDays/*[/day == "+today+"]").value();

    this.delayedAttendanceUpdate = _.debounce(function (divClass, event) {
      console.log(divClass, event.target.value, attendanceDay);
      dispatch(updateClassAttendance(divClass.id, today, moment().format('YYYY-MM-DD 00:00:00'), event.target.value));
    }, 1000);

    this.setState({
      sparklineWidth: 100,
      attendanceDay: attendanceDay,
      showDialog: false,
      dialogText: 'This is a test',
      dialogTitle: ''
    });
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
    })
    return classDay;
  }

  attendanceUpdate(divClass, e) {
    const { attendanceDay } = this.state;
    e.persist();
    this.delayedAttendanceUpdate(divClass, e);
  }

  getClassAttendance(divClass) {
    let attendance = (divClass.divisionClassAttendances.length) ? divClass.divisionClassAttendances[0].count : 0,
        isToday = false;
    if (attendance) {
      isToday = moment(divClass.divisionClassAttendances[0].attendanceDate, "YYYY-MM-DD").isSame(moment(), 'day');
      if (isToday) {
        return attendance.toString();
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
        }),
        series = attendance.data.latest.map(function(day, index){
          return parseInt(day.attendance,10);
        });
    console.log(labels, series);
    return {
      labels: labels,
      series: [series]
    };
  }

  handleCardTouchTap(note, e) {
    this.setState({
      dialogText: note.text,
      dialogTitle: note.title,
      showDialog: true
    });
  }

  handleDialogClose(e) {
    this.setState({
      showDialog: false
    });
  }

  render() {
    const { dispatch, configs, attendance, notes, ...props } = this.props;
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
        displayAttendance = this.displayAttendance(),
        lineChartData = this.getGraphAttendance(),
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
        ];
      console.log(displayAttendance);
    return (
      <div>
        <div className={"mdl-grid"}>
          {displayAttendance.map((attendance, index) =>
            <div key={index} className={"mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone"}>
              <Card>
                <CardHeader
                  title={attendance.config.title+" Attendance"}
                  subtitle={moment().format("dddd MM/DD/YYYY")}
                  avatar={<Avatar>{moment().format("dd")}</Avatar>}>
                </CardHeader>
                  <div className={"mdl-grid"}>
                    {attendance.classes.map((divClass, index) =>
                      <div key={divClass.id} className={"mdl-cell mdl-cell--4-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone"}>
                        <div className={"mdl-typography--subhead"}>{divClass.class.title}</div>
                        <TextField
                          type="number"
                          hintText="Enter attendance"
                          defaultValue={::this.getClassAttendance(divClass)}
                          min="0"
                          max="500"
                          onChange={((...args)=>this.attendanceUpdate(divClass, ...args))}
                          floatingLabelText="Class Attendance" />
                      </div>
                    )}
                  </div>
                <CardMedia>
                </CardMedia>
              </Card>
            </div>
          )}
          <div className={"mdl-cell mdl-cell--6-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone"}>
            <DashboardMediumGraph
              title={"Attendance"}
              subtitle={"Past 8 weeks"}
              avatar={<Avatar>A</Avatar>}
              lineChartData={lineChartData}
              lineChartOptions={lineChartOptions}
            />
          </div>
          <div className={"mdl-cell mdl-cell--6-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone"}>
            <Masonry>
              {notes.data.map((note, index) =>
                <div key={index} style={styles.noteSmall}>
                  <Card
                    onClick={((...args)=>this.handleCardTouchTap(note, ...args))}>
                    <CardText>
                      {note.text}
                    </CardText>
                  </Card>
                </div>
              )}
            </Masonry>
          </div>
          <div className={"mdl-cell mdl-cell--3-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone"}>
            <DashboardComponentSmall
              zDepth={1}
              sparkLineData={[5, 10, 5, 20, 5, 30, 25, 10, 18, 32, 22, 28, 30, 21, 45, 29, 33, 18, 10, 15]}
              title={"Avg. Attendance"}
              body={attendance.data.average[0].attendance}
              style={paperStyle}
            />
          </div>
        </div>
        <Dialog
          title={
            <TextField
              style={{margin: "25px"}}
              hintText="Title"
              defaultValue={this.state.dialogTitle} />
          }
          actions={customActions}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.showDialog}
          onRequestClose={::this.handleDialogClose}>
          <Editor
            className="editor"
            text={this.state.dialogText}
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
