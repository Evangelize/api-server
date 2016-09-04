import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash/fp';
import moment from 'moment-timezone';
import Masonry from 'react-masonry-component';;
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import DashboardComponentSmall from '../components/DashboardComponentSmall';
import DashboardMediumGraph from '../components/DashboardMediumGraph';
import DivisionConfigsTeachers from '../components/DivisionConfigsTeachers';
import DivisionConfigsAttendance from '../components/DivisionConfigsAttendance';
import DisplayNotes from '../components/DisplayNotes';
import * as Colors from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-bootstrap';

@inject('classes', 'settings')
@observer
class Dashboard extends Component {
  @observable showDialog = false;
  @observable currentNote = {
    id: null,
    title: null,
    text: null,
  };
  @observable masonryOptions = {};
  @observable now = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();

  resize() {
    throttle(30)(() => {
      this.masonryOptions.updated = true;
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  handleNewNote(e) {
    this.currentNote = {
      id: null,
      title: null,
      text: null,
    };
    this.showDialog = true;
  }

  highlightText(e) {
    if (e) {
      e.target.select();
    }
  }

  render() {
    console.log('dashboard:pre-render', moment().unix());
    const { classes } = this.props;
    const paperStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: '75px',
      backgroundColor: Colors.cyan300,
      color: 'white',
    };
    const lineChartOptions = {
      low: 0,
      showArea: true,
    };
    console.log('dashboard:render', moment().unix());
    return (
      <Row>
        <Grid fluid>
          {classes.isClassDay() && <DivisionConfigsAttendance divisionConfigs={classes.getDivisionConfigs()} date={this.now} />}
          <Masonry className={"row"} options={this.masonryOptions}>
            {classes.getClassMeetingDays().map((day, index) =>
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <DashboardMediumGraph
                  title={moment().weekday(day.day).format('dddd') + ' Attendance'}
                  subtitle={"Past 8 weeks"}
                  avatar={<Avatar>A</Avatar>}
                  lineChartData={classes.getGraphAttendance(day.day, 8)}
                  lineChartOptions={lineChartOptions}
                />
              </Col>
            )}
            {classes.isClassDay() && <DivisionConfigsTeachers divisionConfigs={classes.getDivisionConfigs()} date={this.now} />}
            <Col xs={12} sm={12} md={6} lg={6}>
              {classes.getClassMeetingDays().map((day, index) =>
                <div key={day.id}>
                <Col xs={12} sm={6} md={6} lg={6} key={index}>
                  <DashboardComponentSmall
                    zDepth={1}
                    title={'Avg. Attendance '+moment().weekday(day.day).format('dddd')}
                    body={classes.avgAttendance(day.day)}
                    style={paperStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6} key={'pc'+index}>
                  <DashboardComponentSmall
                    zDepth={1}
                    title={'Attendance Change '+moment().weekday(day.day).format('dddd')}
                    body={classes.attendancePercentChange(day.day)}
                    style={paperStyle}
                  />
                </Col>
                </div>
              )}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Toolbar>
                <ToolbarGroup key={0} style={{ float: 'left' }}>
                  <ToolbarTitle text="Notes" />
                </ToolbarGroup>
                <ToolbarGroup key={1} style={{ float: 'right' }}>
                  <RaisedButton
                    label="Add Note"
                    secondary
                    onClick={::this.handleNewNote}
                  />
                </ToolbarGroup>
              </Toolbar>
              <DisplayNotes />
            </Col>
            
          </Masonry>
        </Grid>
      </Row>
    );
  }
}

export default Dashboard;
