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
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import DashboardMediumGraph from '../../components/DashboardMediumGraph';
import NavToolBar from '../../components/NavToolBar';
import RenderTeachers from '../../components/RenderTeachers';
import Async from '../../components/Async';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};
//let Masonry = MasonryCtl(React);

@inject('classes')
@observer
class Class extends Component {
  @observable cls;
  @observable yearId;
  @observable divisionClass;
  @observable currentDivision;
  @observable slideIndex = 'overview';
  @observable showYear = false;
  componentWillMount() {
    const { params } = this.props;
    const { classes } = this.props;
    this.cls = classes.getClass(params.classId);
    this.divisionClass = classes.getClassCurrentDivision(params.classId);
    this.currentDivision = (this.divisionClass) ? classes.getDivision(this.divisionClass.divisionId) : null;
    this.studentYearId = (this.currentDivision) ? classes.getClassGroupingYear(this.currentDivision.divisionYear).id : null;
    this.setState({
      masonryOptions: {},
    });
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

  render() {
    const { params } = this.props;
    const { classes } = this.props;
    const { masonryOptions } = this.state;
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
                <ToolbarGroup key={2} lastChild style={{ float: 'right' }}>
                  {this.showYear &&
                    <DropDownMenu
                      value={this.yearId}
                      onChange={this.selectedYear}
                      style={{ marginRight: '12px' }}
                    >
                      {this.currentDivision && classes.getClassGroupingYears(this.currentDivision.divisionConfigId).map((year) =>
                        <MenuItem key={year.id} value={year.id} label={moment(year.endDate).format('YYYY')} primaryText={moment(year.endDate).format('YYYY')} />
                      )}
                    </DropDownMenu>
                  }
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Tabs
                value={this.slideIndex}
                onChange={this.changeTab}
              >
                <Tab
                  label="Overview"
                  value={'overview'}
                >
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div>
                        <span className="button">{(this.currentDivision) ? this.currentDivision.title : ''}</span> <br />
                        <span className="caption">
                          {(this.currentDivision) ? moment(this.currentDivision.start).tz('America/Chicago').format('dddd, MMM DD YYYY') : ''} -
                           {(this.currentDivision) ? moment(this.currentDivision.end).tz('America/Chicago').format('dddd, MMM DD YYYY') : ''}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Masonry className={"row"} options={masonryOptions}>

                    {classes.getClassMeetingDays().map((day) =>
                      <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                        <DashboardMediumGraph
                          title={`${moment().weekday(day.day).format('dddd')} Attendance`}
                          subtitle={'Past 8 weeks'}
                          avatar={<Avatar>A</Avatar>}
                          lineChartData={classes.getGraphAttendance(day.day, 8)}
                          lineChartOptions={lineChartOptions}
                        />
                      </Col>
                    )}

                    {classes.getClassMeetingDays().map((day) =>
                      <Col xs={12} sm={12} md={6} lg={6} key={day.id}>
                        <Card>
                          <CardHeader
                            title={'Teachers'}
                            subtitle={moment().weekday(day.day).format('dddd')}
                            avatar={<Avatar>{moment().weekday(day.day).format('dd')}</Avatar>}
                          />
                          <CardMedia><RenderTeachers divClass={this.divisionClass} day={day.day} /></CardMedia>
                        </Card>
                      </Col>
                    )}
                  </Masonry>
                </Tab>
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
                      <Async
                        pendingRender={<div />}
                        promise={classes.getClassTeachers(this.cls.id)}
                        then={(teachers) =>
                          <List>
                            {teachers.resultset.map((teacher) =>
                              <div key={teacher.id}>
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
                                  primaryText={`${teacher.person.lastName}, ${teacher.person.firstName}`}
                                  secondaryText={`Last Taught: ${classes.getDivisionClass(teacher.divisionClassId).division.title} ${moment(classes.getDivisionClass(teacher.divisionClassId).division.start, 'x').fquarter(-4).year} - ${moment().isoWeekday(teacher.divClassTeacher.day).format('dddd')}`}
                                />
                              </div>
                          )}
                          </List>
                        }
                      />
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
