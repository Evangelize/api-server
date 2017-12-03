import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
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

const colStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      divStyle = { width: '85%' };

@inject('classes')
@observer
class ClassAttendance extends Component {
  @observable division;
  @observable meetingDay;
  @observable day;
  componentWillMount() {
    const { divClass, date } = this.props;
    const { classes } = this.props;
    this.day = moment(date).day();
    this.division = classes.getDivision(divClass.divisionId);
    this.meetingDay = classes.getCurrentDivisionMeetingDays(this.division.divisionYear, this.day);
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  attendanceUpdate = (e) => {
    const { divClass, date } = this.props;
    const { classes } = this.props,
          { now } = this.state;
    console.log('attendanceUpdate', moment().unix());
    classes.updateClassAttendance(divClass.id, date, parseInt(e.target.value, 10), this.meetingDay.id);
  }

  isUpdating() {
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

  highlightText = (e) => {
    if (e) {
      e.target.setSelectionRange(0, 9999);
    }
  }

  render() {
    const { divClass, date } = this.props;
    const { classes } = this.props;

    return (
      <Col style={colStyle} key={divClass.id} xs={12} sm={6} md={4} lg={3}>
        <div style={divStyle}>
          <TextField
            type="tel"
            hintText="Enter attendance"
            value={classes.getClassAttendance(divClass.id, date)}
            min="0"
            max="500"
            ref={`inputAttendance${divClass.id}`}
            onFocus={this.highlightText}
            onChange={this.attendanceUpdate}
            floatingLabelText={classes.getClass(divClass.classId).title}
          />
        </div>
      </Col>
    );
  }
}
export default ClassAttendance;
