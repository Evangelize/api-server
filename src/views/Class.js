import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import momentFquarter from 'moment-fquarter';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
import Masonry from 'react-masonry-component';
import Styles from 'material-ui/styles';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import CardTitle from 'material-ui/Card/CardTitle';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../components/NavToolBar';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};
//let Masonry = MasonryCtl(React);

@connect
class Class extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    //this.setState({});
    //console.log("class", cls);
    this.setState({
      masonryOptions: {}
    });
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("will update", nextProps, nextState);
  }

  componentDidMount() {

  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  navigate(path, e) {
    browserHistory.push(path);
  }
  
  getGraphAttendance(day, length) {
    const { params } = this.props;
    const { classes } = this.context.state;
    let attendance = classes.getClassAttendanceByDay(params.classId, day),
        labels = attendance.map(function(day, index){
          return moment.utc(day.attendanceDate).tz("America/Chicago").format("MM/DD");
        }),
        series = attendance.map(function(day, index){
          return parseInt(day.count,10);
        });
    //console.log("graphAttendance", labels, series);
    return {
      labels: labels,
      series: [series]
    };
  }

  updateTitle(e) {
    const { classes } = this.context.state;
    const { params } = this.props,
          { now } = this.state;
    classes.updateCollectionFields("classes", params.classId, {title: e.target.value});
  }

  render() {
    const { params } = this.props;
    const { classes } = this.context.state;
    const cls = classes.getClass(params.classId),
          teachers = classes.getClassTeachers(cls.id),
          currentDivision = classes.getCurrentDivision(),
          divisionClass = classes.getDivisionClassByDivAndClass(currentDivision.id, cls.id),
          meetingDays = classes.getClassMeetingDays();
    const { masonryOptions } = this.state;
    let lineChartOptions = {
          low: 0,
          showArea: true
        };
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel={cls.title} goBackTo="/classes" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              
              <Tabs>
                <Tab label="Overview" >
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div>
                        <span className="button">{currentDivision.title}</span> <br />
                        <span className="caption">{moment(currentDivision.start).tz("America/Chicago").format("dddd, MMM DD YYYY")} - {moment(currentDivision.end).tz("America/Chicago").format("dddd, MMM DD YYYY")}</span>
                      </div>
                    </Col>
                  </Row>
                  <Masonry className={"row"} options={masonryOptions}>
                    
                    {meetingDays.map((day, index) =>
                      <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                        <DashboardMediumGraph
                          title={moment().weekday(day.day).format("dddd") + " Attendance"}
                          subtitle={"Past 8 weeks"}
                          avatar={<Avatar>A</Avatar>}
                          lineChartData={::this.getGraphAttendance(day.day, 8)}
                          lineChartOptions={lineChartOptions}
                        />
                      </Col>
                    )}

                    {meetingDays.map((day, index) =>
                      <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                        <Card>
                          <CardHeader
                            title={"Teachers"}
                            subtitle={moment().weekday(day.day).format("dddd")}
                            avatar={<Avatar>{moment().weekday(day.day).format("dd")}</Avatar>}>
                          </CardHeader>
                          <CardMedia>
                            <List>
                              {classes.getDivisionClassTeachers(divisionClass.divisionClass.id, day.day).map((teacher, index) =>
                                <div
                                  key={index} > 
                                  <Divider />
                                  <ListItem
                                    leftAvatar={
                                      <Avatar 
                                        src={
                                          (teacher.person.individualPhotoUrl) ? 
                                            teacher.person.individualPhotoUrl : 
                                            teacher.person.familyPhotoUrl
                                          }
                                        >
                                          {
                                            (teacher.person.individualPhotoUrl || teacher.person.familyPhotoUrl) ? 
                                              null : 
                                              teacher.person.firstName.charAt(0)
                                          }
                                        </Avatar>
                                    }
                                    primaryText={teacher.person.lastName + ", " + teacher.person.firstName}
                                  />
                                </div>
                              )}
                            </List>
                          </CardMedia>
                        </Card>
                      </Col>
                    )}
                    
                  </Masonry>
                </Tab>
                <Tab
                  label="Edit">
                  <div>
                    <TextField
                      value={cls.title}
                      onChange={((...args)=>this.updateTitle(...args))}
                      hintText="Class Title" />
                  </div>
                </Tab>
                <Tab label="Teacher History" >
                  <Card>
                    <CardHeader
                      title={"Teachers"}
                      subtitle={"All teachers who have taught class"}
                      avatar={<Avatar>{"T"}</Avatar>}>
                    </CardHeader>
                    <CardMedia>
                      <List>
                        {teachers.map((teacher, index) =>
                          <div
                            key={index} > 
                            <Divider />
                            <ListItem
                              leftAvatar={
                                <Avatar 
                                  src={
                                    (teacher.person.individualPhotoUrl) ? 
                                      teacher.person.individualPhotoUrl : 
                                      teacher.person.familyPhotoUrl
                                    }
                                  >
                                    {
                                      (teacher.person.individualPhotoUrl || teacher.person.familyPhotoUrl) ? 
                                        null : 
                                        teacher.person.firstName.charAt(0)
                                    }
                                  </Avatar>
                              }
                              primaryText={teacher.person.lastName + ", " + teacher.person.firstName}
                              secondaryText={"Last Taught: "+teacher.division.title+" "+moment(teacher.division.start, "x").fquarter(-4).year+" - "+moment().isoWeekday(teacher.divClassTeacher.day).format("dddd")}
                            />
                          </div>
                        )}
                      </List>
                    </CardMedia>
                  </Card>
                </Tab>
                <Tab
                  label="Students"
                >
                  <div>
                    <h2 style={styles.headline}>Tab Three</h2>
                    <p>
                      This is a third example tab.
                    </p>
                  </div>
                </Tab>
              </Tabs>
              
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Class;
