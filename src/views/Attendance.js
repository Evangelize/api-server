import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import spahql from 'spahql';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
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

@connect(state => ({
  classes: state.classes
}))
@observer
class Attendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    //this.setState({});
  }

  componentDidMount() {

  }


  handleEditAttendance(day, index, e) {
    const { configs } = this.props;
    //let db = spahql.db(configs.data);
    let path = "/attendance/" + day.date;
    this.navigate(path);
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
    browserHistory.push(path);
  }

  render() {
    const { classes, ...props } = this.props;
    let endMonth = moment(moment().format("MM/01/YYYY")+" 00:00:00").add(1, "month").valueOf();
    //console.log("render", attendance);
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div style={{margin: "0 0.5em"}}>
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
                    {classes.getDailyAttendance(endMonth).map((day, index) =>
                      <ListItem
                        key={index}
                        rightAvatar={<Avatar>{day.count}</Avatar>}
                        onTouchTap={((...args)=>this.handleEditAttendance(day, index, ...args))}
                        primaryText={moment(day.date, "x").format("dddd")}
                        secondaryText={moment(day.date, "x").format("MMMM Do YYYY")} />
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

export default Attendance;
