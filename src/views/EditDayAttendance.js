import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import spahql from 'spahql';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Styles from 'material-ui/lib/styles';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/divider';
import ListItem from 'material-ui/lib/lists/list-item';
import CheckCircle from 'material-ui/lib/svg-icons/action/check-circle';
import TextField from 'material-ui/lib/text-field';
import Avatar from 'material-ui/lib/avatar';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import CircularProgress from 'material-ui/lib/circular-progress';
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

<<<<<<< HEAD
  navigate(path, e) {
    browserHistory.push(path);
=======
  attendanceUpdate(divClass, e) {
    const { dispatch, configs, params } = this.props,
          { attendances, weekday, day } = this.state,
          db = spahql.db(divClass),
          today = moment.utc(day.attendanceDate).tz("America/Chicago"),
          attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ "+today.valueOf()+"]"),
          exists = attendance.values.length,
          count = parseInt(e.target.value, 10);
    let attend = {};
    e.persist();
    if (!exists) {
      attend = {
        attendanceDate: today.format("YYYY-MM-DD")+"T00:00:00.000Z",
        count: count,
        createdAt: today.format("YYYY-MM-DD")+"T00:00:00.000Z",
        day: weekday,
        deletedAt: null,
        divisionClassId: divClass.id,
        id: null,
        revision: null,
        updatedAt: today.format("YYYY-MM-DD")+"T00:00:00.000Z",
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

  handleTeacherTouchTap(teacher, divisionClass, e, el) {
    this.refs.snackbar.setState({
      teacher: teacher,
      divClass: divisionClass
    })
    this.refs.snackbar.show();
  }

  _handleInputChange(e) {
    const { people, dispatch } = this.props,
          filter = e.target.value;
    if (filter.length > 1) {
      dispatch(getPeople(people.key, e.target.value));
    }
  }

  _handleSelectValueChange(e) {
    const { people } = this.props;
    people.key = e.target.value;
  }

  menuItemTap(person, item, event) {
    const { dispatch, params, configs } = this.props;
    const { attendances, weekday } = this.state;
    let db = spahql.db(configs.data),
        divClass = db.select(divClassPath).value(),
        opts;
    switch (item) {
      case "confirm":
        opts = {confirmed: true};
        break;
      case "unconfirm":
        opts = {confirmed: false};
        break;
      default:
        opts = null;
        break;
    };
    dispatch(
      manageDivisionClassTeacher(
        item,
        config.id,
        year.id,
        division.id,
        divClass.id,
        classDay.day,
        person.id,
        opts
      )
    );
>>>>>>> master
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
<<<<<<< HEAD
    const { params, classes, ...props } = this.props;
=======
    const { dispatch, params, configs, ...props } = this.props,
          { weekday, displayAttendance, attendances } = this.state;
    console.log(attendances);
    let db = spahql.db(configs.data);
>>>>>>> master
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
<<<<<<< HEAD
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
=======
          {displayAttendance.map((attendance, index) =>
            <Row key={attendance.id}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card>
                  <CardHeader
                    title={attendance.config.title+" Attendance"}
                    subtitle={moment.utc(attendances[0].attendanceDate).format("dddd MM/DD/YYYY")}
                    avatar={<Avatar>{moment.utc(attendances[0].attendanceDate).format("dd")}</Avatar>}>
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
>>>>>>> master
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

<<<<<<< HEAD
export default EditDayAttendance;
=======
EditDayAttendance.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return {
    configs: state.divisionConfigs.present,
    people: state.people.present,
    attendance: state.attendance.present
  };
}

export default connect(select)(EditDayAttendance);
>>>>>>> master
