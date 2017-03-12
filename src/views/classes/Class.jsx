import React, { Component } from 'react';
import moment from 'moment-timezone';
import momentFquarter from 'moment-fquarter';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Masonry from 'react-masonry-component';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import DashboardMediumGraph from '../../components/DashboardMediumGraph';
import NavToolBar from '../../components/NavToolBar';
import RenderTeachers from '../../components/RenderTeachers';
import DisplayTeacher from '../../components/DisplayTeacher';

@inject('classes')
@observer
class Class extends Component {
  @observable cls;
  @observable yearId;
  @observable divisionClass;
  @observable currentDivision;
  @observable slideIndex = 'overview';
  @observable showYear = false;
  @observable currentTeachers;
  @observable masonryOptions = [];
  componentWillMount() {
    const { params } = this.props;
    const { classes } = this.props;
    this.cls = classes.getClass(params.classId);
    this.divisionClass = classes.getClassCurrentDivision(params.classId);
    this.currentDivision = (this.divisionClass) ? classes.getDivision(this.divisionClass.divisionId) : null;
    this.yearId = (this.currentDivision) ? classes.getClassGroupingYear(this.currentDivision.divisionYear).id : null;
    this.currentTeachers = (this.currentDivision) ? classes.getClassTeachers(this.cls.id) : [];
  }

  componentDidMount() {
  }

  getGraphAttendance(day, length) {
    const { params } = this.props;
    const { classes } = this.props;
    const attendance = classes.getClassAttendanceByDay(params.classId, day);
    const labels = attendance.map((day1) => moment.utc(day1.attendanceDate).tz('America/Chicago').format('MM/DD'));
    const series = attendance.map((day1) => parseInt(day1.count, 10));
    //console.log("graphAttendance", labels, series);
    return {
      labels,
      series: [series],
    };
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  formatDateRange(division) {
    return moment(division.start).format('MMM D YYYY') + ' - ' + moment(division.end).format('MMM D YYYY');
  }

  updateTitle(e) {
    const { classes } = this.props;
    const { params } = this.props;
    classes.db.updateCollectionFields('classes', params.classId, { title: e.target.value });
  }

  selectedYear = (event, selectedIndex, value) => {
    this.yearId = value;
    // console.log(menuItem);
  }

  changeTab = (index) => {
    this.slideIndex = index;
    this.showYear = (index === 'students' || index === 'teachers') ? true : false;
  }

  addStudent = (e) => {
    const { params } = this.props;

    browserHistory.push(`/classes/${params.classId}/${this.yearId}/students`);
  }

  render() {
    const { params } = this.props;
    const { classes } = this.props;
    let lineChartOptions = {
      low: 0,
      showArea: true,
    };
    let retVal;
    if (this.cls) {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel={this.cls.title} goBackTo="/classes" >
                  {this.showYear && this.currentDivision &&
                    <ToolbarGroup key={2} lastChild style={{ float: 'right' }}>
                      <DropDownMenu
                        value={this.yearId}
                        onChange={this.selectedYear}
                        style={{ marginRight: '12px' }}
                      >
                        {classes.getClassGroupingYears(this.currentDivision.divisionConfigId).map((year) =>
                          <MenuItem key={year.id} value={year.id} label={moment(year.endDate).format('YYYY')} primaryText={moment(year.endDate).format('YYYY')} />
                        )}
                      </DropDownMenu>
                      <RaisedButton
                        label="Add Student"
                        secondary
                        onTouchTap={this.addStudent}
                      />
                    </ToolbarGroup>
                  }
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Tabs
                value={this.slideIndex}
                onChange={(...args) => this.changeTab(...args)}
              >
                {this.currentDivision &&
                  <Tab
                    label="Overview"
                    value={'overview'}
                  >
                    
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <div>
                          <span className="button">{(this.currentDivision) ? this.currentDivision.title : ''}</span> <br />
                          <span className="caption">
                            {(this.currentDivision) ? moment(this.currentDivision.start).tz('America/Chicago').format('dddd, MMM DD YYYY') : ''}&nbsp;-
                            &nbsp;{(this.currentDivision) ? moment(this.currentDivision.end).tz('America/Chicago').format('dddd, MMM DD YYYY') : ''}
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Masonry className={"row"} options={this.masonryOptions}>
                      {classes.getYearMeetingDays(this.yearId).map((day) =>
                        <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                          <DashboardMediumGraph
                            title={`${moment().weekday(day.dow).format('dddd')} Attendance`}
                            subtitle={'Past 8 weeks'}
                            avatar={<Avatar>A</Avatar>}
                            lineChartData={classes.getGraphAttendance(day.dow, 8)}
                            lineChartOptions={lineChartOptions}
                          />
                        </Col>
                      )}

                      {classes.getYearMeetingDays(this.yearId).map((day) =>
                        <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                          <Card>
                            <CardHeader
                              title={'Teachers'}
                              subtitle={moment().weekday(day.dow).format('dddd')}
                              avatar={<Avatar>{moment().weekday(day.dow).format('dd')}</Avatar>}
                            />
                            <CardMedia><RenderTeachers divClass={this.divisionClass} day={day.dow} /></CardMedia>
                          </Card>
                        </Col>
                      )}
                    </Masonry>
                  </Tab>
                }
                {!this.currentDivision &&
                  <Tab
                    label="Overview"
                    value={'overview'}
                  >
                    
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        This class is not configured for the current quarter.
                      </Col>
                    </Row>
                  </Tab>
                }
                <Tab
                  label="Teachers"
                  value={'teachers'}
                >
                  <Card>
                    <CardHeader
                      title={"Teachers"}
                      subtitle={"All teachers who have taught class"}
                      avatar={<Avatar>{"T"}</Avatar>}
                    />
                    <CardMedia>
                      <List>
                        {this.currentTeachers.map((teacher) =>
                          <DisplayTeacher
                            teacher={teacher}
                            key={teacher.id}
                            secondaryText={`Last Taught: ${classes.getDivisionClass(teacher.divisionClassId).division.title} ${moment(classes.getDivisionClass(teacher.divisionClassId).division.start, 'x').fquarter(-4).year}`}
                          />
                        )}
                      </List>
                    </CardMedia>
                  </Card>
                </Tab>
                <Tab
                  label="Students"
                  value={'students'}
                >
                  <Card>
                    <CardHeader
                      title={"Students"}
                      subtitle={"Current Student Roster"}
                      avatar={<Avatar>{"S"}</Avatar>}
                    />
                    <CardMedia>
                      <List>
                      {classes.getClassYearStudents(this.cls.id, this.yearId).map((student) =>
                        <div key={student.id}>
                          <Divider />
                          <ListItem
                            leftAvatar={
                              <Avatar
                                src={
                                  (student.individualPhotoUrl) ?
                                    student.individualPhotoUrl :
                                    student.familyPhotoUrl
                                  }
                              >
                                {
                                  (student.individualPhotoUrl || student.familyPhotoUrl) ?
                                    null :
                                    student.firstName.charAt(0)
                                }
                              </Avatar>
                            }
                            primaryText={`${student.lastName}, ${student.firstName}`}
                            secondaryText={`Birthday: ${moment(student.birthday).format('MMM DD YYYY')}`}
                          />
                        </div>
                      )}
                      </List>
                    </CardMedia>
                  </Card>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Grid>
      );
    } else {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="No Class Selected" goBackTo="/classes" />
            </Col>
          </Row>
        </Grid>
      );
    }
    return retVal;
  }
}

export default Class;
