import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Slider from 'react-slick';
import * as Colors from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import CardTitle from 'material-ui/Card/CardTitle';
import DropDownMenu from 'material-ui/DropDownMenu';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import MediaQuery from 'react-responsive';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import { Grid, Row, Col } from 'react-bootstrap';
import { manageDivisionClassTeacher, getDivisionsConfigs } from '../actions';

@connect(state => ({
  classes: state.classes
}))
@observer
class Schedules extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { classes } = this.props;
    let divisionConfig = classes.collections.divisionConfigs.data[0],
        year = classes.getCurrentDivisionYear(divisionConfig.id),
        divSchedules = classes.getDivisionSchedules(divisionConfig.id, year.id),
        schedule = classes.getCurrentDivisionSchedule(divisionConfig.id, year.id);

    this.setState({
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      height: '300px',
      displayRowCheckbox: false,
      adjustForCheckbox: false,
      displaySelectAll: false,
      academicYear: year.id,
      divisionConfig: divisionConfig.id,
      divSchedules: divSchedules,
      division: schedule[0].id,
      schedule: schedule,
      snackBar: {
        autoHideDuration: 2500,
        message: "No teacher selected",
        action: "Add Teacher",
        selectedItem: null
      }
    });
  }

  componentDidMount() {

  }

  getSchedule(config, year) {
    const { configs } = this.props,
          state = (config && year) ? false : true;
    if (state) {
      const { divisionConfig, academicYear } = this.state;
    }
    config = config || divisionConfig;
    year = year || academicYear;
    let db = spahql.db(configs.data),
        schedule = db.select("/*[/id == "+config+"]/divisionYears/*[/id == "+year+"]/divisions/*");
    if (state) {
      this.setState({
        schedule: schedule.values()
      });
    } else {
      return schedule.values();
    }
  }

  getClassMeetingDays() {
    const { configs } = this.props,
          { divisionConfig, academicYear } = this.state;
    let db = spahql.db(configs.data),
        days = db.select("/*[/id == "+divisionConfig+"]/classMeetingDays/*");

    return days.values();
  }

  selectedYear(event, selectedIndex, value) {
    this.setState({academicYear: value});
    //console.log(menuItem);
  }

  selectedDivisionConfig(event, selectedIndex, value) {
    this.setState({divisionConfig: value});
    //console.log(menuItem);
  }

  selectedDivision(event, selectedIndex, value) {
    const { classes } = this.props;
    this.setState({
      division: value,
      schedule: classes.getDivisionSchedule(value, this.state.academicYear)
    });
    //console.log(menuItem);
  }

  formatYears() {
    const { configs } = this.props,
          { divisionConfig, academicYear } = this.state;
    let db = spahql.db(configs.data),
        years = db.select("/*[/id == "+divisionConfig+"]/divisionYears/*").values();
    //console.log("years", years);
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

  renderClassTeachers(divClass, division) {
    const { classes} = this.props;
    let days = classes.getDivisionMeetingDays(division.divisionConfigId),
        classTeachers = [];
    //console.log(divClass);
    days.forEach(function(day, index){
      let results = classes.getDivisionClassTeachers(divClass.divisionClass.id, day.day);
      //console.log("teachers", day.day, results);
      if (results.length) {
        classTeachers.push({
          viewing: false,
          day: day,
          id: _.uniqueId(),
          teachers: results
        });
      } else {
        classTeachers.push({
          day: day,
          viewing: false,
          id: _.uniqueId(),
          teachers: [{
            'id': _.uniqueId(),
            'day': day.day,
            'divisionClassId': divClass.divisionClass.id,
            'peopleId': 0,
            'person': {
              'lastName': 'Assigned',
              'firstName': 'Not'
            },
            'divClassTeacher': {
              confirmed: false
            }
          }]
        });
      }
    });

    return classTeachers;
  }

  setAnchor(positionElement, position='bottom') {
    let {anchorOrigin} = this.state;
    anchorOrigin[positionElement] = position;

    this.setState({
      anchorOrigin:anchorOrigin,
    });
  }

  setTarget(positionElement, position='bottom') {
    let {targetOrigin} = this.state;
    targetOrigin[positionElement] = position;

    this.setState({
      targetOrigin:targetOrigin,
    });
  }

  handleTeacherTouchTap(teacher, divisionClass, e, el) {
    //console.log(teacher);
    this.refs.snackbar.setState({
      teacher: teacher,
      divClass: divisionClass
    })
    this.handleEditDay(divClass, teacher, e);
  }

  handleSnackbarAction(e) {
    let { teacher, divClass } = this.refs.snackbar.state;
    this.handleEditDay(divClass, teacher, e);
  }

  handleEditDay(divClass, day, e) {
    let { divisionConfig, academicYear} = this.state,
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionClass.id + "/" + day.day.day;
    browserHistory.push(path);
  }

  listToggle(day, e) {
    day.viewing = !day.viewing;
  }

  getLeftIcon(day) {
    console.log("getLeftIcon", day);
    if (day.viewing) {
      return (<ContentAdd />);
    } else {
      return (<ContentRemove />);
    }
  }

  confirmTeacher(divClass, classDay, teacher, event) {
    const { params, classes } = this.props;
    let opts,
        confirmed = !teacher.divClassTeacher.confirmed;
    classes.confirmTeacher(confirmed, divClass.divisionClass.id, teacher.divClassTeacher.id);
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { configs, classes, ...props } = this.props,
          iconButtonElement = (
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left">
              <MoreVertIcon color={Colors.grey400} />
            </IconButton>
          );
    //console.log("render", configs.data.data);
    let gridLayout = {
          className: "layout",
          isDraggable: false,
          isResizable: false,
          cols: 12,
          rowHeight: 50
        },
        grid = {
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        },
        tileDay = {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: Colors.grey300,
          borderLeft: "1px solid "+ Colors.grey400
        },
        tileClassName = {
          padding: "2%",
          display: "table",
          width: "100%"
        },
        tileTeacher = {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderLeft: "1px solid "+ Colors.grey400
        },
        stripe = {
          backgroundColor: Colors.grey100
        },
        settings = {
          arrows: false,
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 4,
          responsive: [
            { breakpoint: 9999, settings: { slidesToShow: 3, arrows: false } },
            { breakpoint: 1700, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 1025, settings: { slidesToShow: 1, arrows: false } }
          ]
        },
        divisionOptions = [
          { payload: 'children', text: 'Children' },
          { payload: 'adult', text: 'Adult' }
        ],
        filterOptions = [
          { payload: '2015', text: 'AY 2015' },
          { payload: '2016', text: 'AY 2016' },
          { payload: '2017', text: 'AY 2017' },
          { payload: '2018', text: 'AY 2018' },
        ],
        iconMenuItems = [
          { payload: '1', text: 'Download' },
          { payload: '2', text: 'More Info' }
        ],
        iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        };
    console.log("academicYear", this.state.academicYear);
    if (window) {
      const { innerWidth } = window;
      const { responsive } = settings;

      const correctSettings = responsive.reduce(
        (previous = { breakpoint: 0 }, current) =>
          previous.breakpoint > innerWidth &&
          current.breakpoint > innerWidth &&
          previous.breakpoint > current.breakpoint ?
            current : previous
      );

      settings = { ...settings, ...correctSettings.settings };
    }
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <nav className={"grey darken-1"}>
              <div className={"nav-wrapper"}>
                <div style={{margin: "0 0.5em"}}>
                  <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                  <a className={"breadcrumb"}>Schedules</a>
                </div>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Toolbar
              style={{flexWrap: "wrap"}}
            >
              <ToolbarGroup key={0} float="left">
                <DropDownMenu value={this.state.divisionConfig} ref="divisionConfig" onChange={::this.selectedDivisionConfig} style={{marginRight: "12px"}}>
                  {classes.collections.divisionConfigs.data.map((config, index) =>
                    <MenuItem key={config.id} value={config.id} label={config.title} primaryText={config.title}/>
                  )}
                </DropDownMenu>
                <DropDownMenu ref="academicYear" value={this.state.academicYear} onChange={::this.selectedYear} style={{marginRight: "0px"}} >
                  {::classes.getDivisionYears(this.state.divisionConfig).map((year, index) =>
                    <MenuItem key={year.id} value={year.id} label={moment(year.startDate).format("YYYY")} primaryText={moment(year.startDate).format("YYYY")}/>
                  )}
                </DropDownMenu>
                <DropDownMenu ref="divisions" value={this.state.division} onChange={::this.selectedDivision} style={{marginRight: "0px"}} >
                  {::this.state.divSchedules.map((div, index) =>
                    <MenuItem key={div.id} value={div.id} label={div.title} primaryText={div.title}/>
                  )}
                </DropDownMenu>
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right" className={"hidden-xs"}>
                <ToolbarSeparator />
                <RaisedButton label="New Schedule" primary={true} />
              </ToolbarGroup>
            </Toolbar>
          </Col>
        </Row>
        <Row>
              {::this.state.schedule.map((division, index) =>
              <Col xs={12} sm={12} md={12} lg={12} key={division.id}>
                <div style={{marginBottom: "10px"}}>
                  <Card>
                    <CardHeader
                      title={division.title}
                      subtitle={this.formatDateRange(division)}
                      avatar={<Avatar>Q{division.position}</Avatar>}>
                    </CardHeader>
                    <CardMedia>
                      <MediaQuery query='(min-device-width: 1024px)'>
                        <Table
                          fixedHeader={this.state.fixedHeader}
                          fixedFooter={this.state.fixedFooter}
                          selectable={this.state.selectable}
                          multiSelectable={this.state.multiSelectable}
                          onRowSelection={this._onRowSelection}>
                          <TableHeader
                            adjustForCheckbox={this.state.adjustForCheckbox}
                            displaySelectAll={this.state.displaySelectAll}
                            enableSelectAll={this.state.enableSelectAll}>
                            <TableRow>
                              <TableHeaderColumn>Class</TableHeaderColumn>
                              {::classes.getDivisionMeetingDays(division.divisionConfigId).map((day, index) =>
                                <TableHeaderColumn key={day.id}>{moment().isoWeekday(day.day).format("dddd")}</TableHeaderColumn>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody
                            displayRowCheckbox={this.state.displayRowCheckbox}
                            deselectOnClickaway={this.state.deselectOnClickaway}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}>
                            {classes.getCurrentDivisionClasses(division.id).map((divisionClass, index) =>
                              <TableRow selected={false} key={divisionClass.divisionClass.id}>
                                <TableRowColumn>
                                  <h6><a style={{color: Colors.deepOrange500}} href="">{divisionClass.class.title}</a></h6>
                                  <p style={{color: Colors.grey600}}>{divisionClass.class.description}</p>
                                </TableRowColumn>
                                {::this.renderClassTeachers(divisionClass, division).map((teacherDay, index) =>
                                  <TableRowColumn key={index}>
                                    {teacherDay.teachers.map((teacher, index) =>
                                      <div key={index} style={{width: "100%", clear: "both"}}>
                                        <IconButton
                                          style={{
                                            float: "left"
                                          }}
                                          touch={true}
                                          onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}>
                                        <ActionGrade
                                          color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400} />
                                        </IconButton>
                                        <FlatButton
                                          style={{
                                            float: "left",
                                            marginTop: "8px"
                                          }}
                                          key={teacher.id}
                                          label={teacher.person.firstName+" "+teacher.person.lastName}
                                          secondary={true}
                                          onTouchTap={(...args) =>this.handleEditDay(divisionClass, teacherDay, ...args)}
                                          labelPosition="after" />
                                      </div>
                                    )}
                                  </TableRowColumn>
                                )}
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </MediaQuery>
                      <MediaQuery query='(max-device-width: 1023px)'>
                        {classes.getCurrentDivisionClasses(division.id).map((divisionClass, index) =>
                          <div key={divisionClass.divisionClass.id}>
                            <Divider />
                            <List>
                              <Subheader>{divisionClass.class.title}</Subheader>
                              {::this.renderClassTeachers(divisionClass, division).map((teacherDay, index) =>
                                <ListItem
                                  key={index}
                                  primaryText={moment().isoWeekday(teacherDay.day.day).format("dddd")}
                                  initiallyOpen={false}
                                  primaryTogglesNestedList={true}
                                  rightIconButton={
                                    <IconMenu
                                      iconButtonElement={iconButtonElement}
                                      onItemTouchTap={((...args)=>this.handleEditDay(divisionClass, teacherDay, ...args))}>
                                      <MenuItem>Edit</MenuItem>
                                    </IconMenu>
                                  }
                                  nestedItems={teacherDay.teachers.map((teacher, index) =>
                                      <ListItem
                                        key={teacher.id}
                                        primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                                        leftIcon={
                                          <ActionGrade
                                            onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}
                                            color={(teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400} />
                                        }
                                      />,
                                    )}

                                />
                              )}
                            </List>
                          </div>
                        )}
                      </MediaQuery>
                    </CardMedia>
                  </Card>
                </div>
              </Col>
              )}
        </Row>
      </Grid>
    );
  }
}

export default Schedules;
