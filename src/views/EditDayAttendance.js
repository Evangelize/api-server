import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import spahql from 'spahql';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import { ActionCreators } from 'redux-undo';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Styles from 'material-ui/lib/styles';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/lists/list-divider';
import ListItem from 'material-ui/lib/lists/list-item';
import CheckCircle from 'material-ui/lib/svg-icons/action/check-circle';
import TextField from 'material-ui/lib/text-field';
import Avatar from 'material-ui/lib/avatar';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import DropDownIcon from 'material-ui/lib/drop-down-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menu/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import CircularProgress from 'material-ui/lib/circular-progress';
import { Grid, Row, Col } from 'react-bootstrap';
import { updateClassAttendance, updateNote, addNote, updateClassAttendanceLocal } from '../actions';

class EditDayAttendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    console.log("EditDayAttendance:componentWillMount");
    const { configs, params, dispatch } = this.props;

    let db = spahql.db(configs.data);
    let attendances = db.select("/*/divisionYears/*/divisions/*/divisionClasses/*/divisionClassAttendances/*[/attendanceDate =~ '^"+params.date+"']").values(),
        weekday = attendances[0].day;

    this.delayedAttendanceUpdate = _.debounce(function (divClass, count, event) {
      //console.log(divClass, event.target.value, attendanceDay);
      dispatch(updateClassAttendance(divClass.id, weekday, moment.utc(params.date+" 00:00:00Z").format('YYYY-MM-DD 00:00:00'), count));
    }, 500);

    this.setState({
      attendances: attendances,
      weekday: weekday,
      displayAttendance: this.displayAttendance(weekday)
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  formatYears() {
    const { configs } = this.props;
    let years = configs.data[this.state.divisionConfig].divisionYears;
    return years.map(function(year, index){
      return {
        'id': year.id,
        'year': moment(year.endDate).format("YYYY")
      }
    });
  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  displayAttendance(weekday) {
    console.log("displayAttendance");
    const { configs } = this.props;

    let db = spahql.db(configs.data),
        classDay = db.select("/*/classMeetingDays/*[/day == "+weekday+"]").value();

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

  getClassAttendance(divClass) {
    const { params } = this.props;
    let db = spahql.db(divClass),
        attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ '^"+params.date+"']").values();
    //console.log("getClassAttendance", divClass, attendance);
    if (attendance.length) {
      return attendance[0].count.toString();
    } else {
      return "0";
    }
  }

  attendanceUpdate(divClass, e) {
    const { dispatch, configs, params } = this.props,
          { attendances, weekday } = this.state,
          db = spahql.db(divClass),
          attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ '^"+params.date+"']"),
          exists = attendance.values.length,
          count = parseInt(e.target.value, 10);
    let attend = {},
        today = moment.utc(params.date+" 00:00:00Z").format("YYYY-MM-DD")+"T00:00:00.000Z";
    e.persist();
    if (!exists) {
      attend = {
        attendanceDate: today,
        count: count,
        createdAt: today,
        day: weekday,
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
  }

  isUpdating(divClass) {
    const { params } = this.props;
    let db = spahql.db(divClass),
        attendance = db.select("//divisionClassAttendances/*[/attendanceDate =~ '^"+params.date+"']").values();

    if (attendance.length && "updating" in attendance) {
      console.log("isUpdating", true);
      return true;
    } else {
      console.log("isUpdating", false);
      return false;
    }
  }

  highlightText(e) {
    if (e) {
      e.target.select();
    }
  }

  navigate(path, e) {
    const { dispatch } = this.props;
    dispatch(updatePath(path));
  }

  render() {
    const { dispatch, params, configs, ...props } = this.props,
          { weekday, displayAttendance, attendances } = this.state;

    let db = spahql.db(configs.data);
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div className={"col s12 m12 l12"}>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/attendance", ...args))} className={"breadcrumb"}>Attendance</a>
                    <a className={"breadcrumb"}>Edit</a>
                  </div>
                </div>
              </nav>
            </Col>
          </Row>
          {displayAttendance.map((attendance, index) =>
            <Row key={attendance.id}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card>
                  <CardHeader
                    title={attendance.config.title+" Attendance"}
                    subtitle={moment.utc(params.date+" 00:00:00Z").format("dddd MM/DD/YYYY")}
                    avatar={<Avatar>{moment.utc(params.date+" 00:00:00Z").format("dd")}</Avatar>}>
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
        </Grid>
      </div>
    );
  }
}

EditDayAttendance.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return {
    configs: state.divisionConfigs.present,
    people: state.people.present
  };
}

export default connect(select)(EditDayAttendance);
