import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import momentFquarter from 'moment-fquarter';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
import MasonryCtl from 'react-masonry-component';
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
import {Tabs, Tab} from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};
let Masonry = MasonryCtl(React);

@connect(state => ({
  classes: state.classes
}))
@observer
class Class extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    //this.setState({});
    const { classes, params } = this.props;
    let cls = classes.getClass(params.classId);
    console.log("class", cls);
    this.setState({
      class: cls,
      masonryOptions: {}
    });
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
    const { classes } = this.props;
    let attendance = classes.getClassAttendanceByDay(this.state.class.id, day),
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

  render() {
    const { classes } = this.props;
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
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div style={{margin: "0 0.5em"}}>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/classes", ...args))} className={"breadcrumb"}>Classes</a>
                    <a className={"breadcrumb"}>{this.state.class.title}</a>
                  </div>
                </div>
              </nav>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              
              <Tabs>
                <Tab label="Overview" >
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
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        <CardHeader
                          title={"Teachers"}
                          subtitle={"All teachers who have taught class"}
                          avatar={<Avatar>{"T"}</Avatar>}>
                        </CardHeader>
                        <CardMedia>
                          <List>
                            {::classes.getClassTeachers(this.state.class.id).map((teacher, index) =>
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
                                  secondaryText={"Last Taught: "+teacher.division.title+" "+moment(teacher.division.start, "x").fquarter(-4).year}
                                />
                              </div>
                            )}
                          </List>
                        </CardMedia>
                      </Card>
                    </Col>
                  </Masonry>
                </Tab>
                <Tab label="Teachers" >
                  <div>
                    <h2 style={styles.headline}>Tab Two</h2>
                    <p>
                      This is another example tab.
                    </p>
                  </div>
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
