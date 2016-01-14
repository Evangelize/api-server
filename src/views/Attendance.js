import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import spahql from 'spahql';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import { ActionCreators } from 'redux-undo';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Styles from 'material-ui/lib/styles';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import Avatar from 'material-ui/lib/avatar';
import CardTitle from 'material-ui/lib/card/card-title';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import { Grid, Row, Col } from 'react-bootstrap';
import { getDivisionsConfigs } from '../actions';

class Attendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    //this.setState({});
  }

  componentDidMount() {
    const { dispatch, configs } = this.props;
  }

  formatYears() {
    const { configs } = this.props;
    let years = configs.data[this.state.divisionConfig].divisionYears;
    //console.log("years", years);
    return years.map(function(year, index){
      return {
        'id': year.id,
        'year': moment(year.endDate).format("YYYY")
      }
    });
  }

  handleEditAttendance(day, e) {
    const { configs, dispatch } = this.props;
    //let db = spahql.db(configs.data);
    let path = "/attendance/" + moment.utc(day.attendanceDate).format("YYYY-MM-DD");
    dispatch(updatePath(path));
    //console.log(day);
  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  getMeetingDays(division) {
    const { configs } = this.props;
    let days = configs.data[this.state.divisionConfig].classMeetingDays;
    return days.map(function(day, index){
      return {
        'id': day.id,
        'year': moment(day.day).format("YYYY")
      }
    });
  }

  navigate(path, e) {
    const { dispatch } = this.props;
    dispatch(updatePath(path));
  }

  render() {
    const { dispatch, configs, attendance, ...props } = this.props;
    console.log("render", attendance);
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div className={"col s12 m12 l12"}>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                    <a className={"breadcrumb"}>Attendance</a>
                  </div>
                </div>
              </nav>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Children Attendance"}
                  subtitle={"Daily Totals"}
                  avatar={<Avatar>{"C"}</Avatar>}>
                </CardHeader>
                <CardMedia>
                  <List>
                    {attendance.data.latest.map((day, index) =>
                      <ListItem
                        key={day.id}
                        rightAvatar={<Avatar>{day.attendance}</Avatar>}
                        onTouchTap={((...args)=>this.handleEditAttendance(day, ...args))}
                        primaryText={moment.utc(day.attendanceDate).format("dddd")}
                        secondaryText={moment.utc(day.attendanceDate).format("MMMM Do YYYY")} />
                    )}
                  </List>
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Attendance.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return {
    configs: state.divisionConfigs.present,
    attendance: state.attendance.present
  };
}

export default connect(select)(Attendance);
