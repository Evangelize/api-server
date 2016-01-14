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
import Slider from 'react-slick';
import Styles from 'material-ui/lib/styles';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import Avatar from 'material-ui/lib/avatar';
import CardTitle from 'material-ui/lib/card/card-title';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import MediaQuery from 'react-responsive';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import ContentRemove from 'material-ui/lib/svg-icons/content/remove';
import { Grid, Row, Col } from 'react-bootstrap';
import { manageDivisionClassTeacher, getDivisionsConfigs } from '../actions';

class Schedules extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { dispatch, configs } = this.props;
    let db = spahql.db(configs.data),
        year = db.select("/0/divisionYears/0").value(),
        schedule = this.getSchedule(year.divisionConfigId, year.id);

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
      divisionConfig: year.divisionConfigId,
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
    const { dispatch, configs } = this.props;
    if (!configs.hydrated) {
      dispatch(getDivisionsConfigs());
    }
  }

  getSchedule(config, year) {
    const { dispatch, configs } = this.props,
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
    const { dispatch, configs } = this.props,
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

  renderClassTeachers(divClass, cb) {
    const { configs } = this.props,
          { divisionConfig, academicYear } = this.state;
    let db = spahql.db(configs.data),
        days = db.select("/*[/id == "+divisionConfig+"]/classMeetingDays/*").values(),
        classTeachers = [];
    //console.log(divClass);
    days.forEach(function(day, index){
      let results = _.where(divClass.divisionClassTeachers, {day: day.day});
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
            'divisionClassId': divClass.id,
            'peopleId': 0,
            'person': {
              'lastName': 'Assigned',
              'firstName': 'Not'
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
    const { dispatch } = this.props;
    let { teacher, divClass } = this.refs.snackbar.state;
    this.handleEditDay(divClass, teacher, e);
  }

  handleEditDay(divClass, day, e) {
    const { dispatch } = this.props;
    let { divisionConfig, academicYear} = this.state,
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionId + "/" + divClass.id+ "/" + day.day.day;
    dispatch(updatePath(path));
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
    const { dispatch, params, configs } = this.props;
    const { divisionConfig, academicYear } = this.state;
    let db = spahql.db(configs.data),
        opts,
        confirmed = (teacher.confirmed) ? "unconfirm" : "confirm";
    dispatch(
      manageDivisionClassTeacher(
        confirmed,
        divisionConfig,
        academicYear,
        divClass.divisionId,
        divClass.id,
        classDay.day.day,
        teacher.id,
        {confirmed: !teacher.confirmed}
      )
    );
  }

  navigate(path, e) {
    const { dispatch } = this.props;
    dispatch(updatePath(path));
  }

  render() {
    const { dispatch, configs, years, ...props } = this.props,
          iconButtonElement = (
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left">
              <MoreVertIcon color={Styles.Colors.grey400} />
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
          backgroundColor: Styles.Colors.grey300,
          borderLeft: "1px solid "+ Styles.Colors.grey400
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
          borderLeft: "1px solid "+ Styles.Colors.grey400
        },
        stripe = {
          backgroundColor: Styles.Colors.grey100
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
        <Snackbar
          ref="snackbar"
          message={this.state.snackBar.message}
          action={this.state.snackBar.action}
          autoHideDuration={this.state.snackBar.autoHideDuration}
          onActionTouchTap={::this.handleSnackbarAction}/>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <nav className={"grey darken-1"}>
              <div className={"nav-wrapper"}>
                <div className={"col s12 m12 l12"}>
                  <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                  <a className={"breadcrumb"}>Schedules</a>
                </div>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Toolbar>
              <ToolbarGroup key={0} float="left">
                <DropDownMenu value={this.state.divisionConfig} ref="divisionConfig" onChange={::this.selectedDivisionConfig} style={{marginRight: "12px"}}>
                  {configs.data.map((config, index) =>
                    <MenuItem key={config.id} value={config.id} label={config.title} primaryText={config.title}/>
                  )}
                </DropDownMenu>
                <DropDownMenu ref="academicYear" value={this.state.academicYear} onChange={::this.selectedYear} style={{marginRight: "0px"}} >
                  {::this.formatYears().map((year, index) =>
                    <MenuItem key={year.id} value={year.id} label={year.year} primaryText={year.year}/>
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
                      <MediaQuery query='(min-device-width: 768px)'>
                        <Table
                          height={this.state.height}
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
                              {::this.getClassMeetingDays().map((day, index) =>
                                <TableHeaderColumn key={day.id}>{moment().isoWeekday(day.day).format("dddd")}</TableHeaderColumn>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody
                            displayRowCheckbox={this.state.displayRowCheckbox}
                            deselectOnClickaway={this.state.deselectOnClickaway}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}>
                            {division.divisionClasses.map((divisionClass, index) =>
                              <TableRow selected={false} key={divisionClass.id}>
                                <TableRowColumn>
                                  <h6><a style={{color: Styles.Colors.deepOrange500}} href="">{divisionClass.class.title}</a></h6>
                                  <p style={{color: Styles.Colors.grey600}}>{divisionClass.class.description}</p>
                                </TableRowColumn>
                                {this.renderClassTeachers(divisionClass).map((teacherDay, index) =>
                                  <TableRowColumn key={teacherDay.day.day}>{teacherDay.teachers.map((teacher, index) =>
                                    <div key={teacherDay.id}>
                                      <IconButton
                                        style={{
                                          float: "left"
                                        }}
                                        touch={true}
                                        onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}>
                                      <ActionGrade
                                        color={(teacher.confirmed) ? Styles.Colors.deepOrange500 : Styles.Colors.grey400} />
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
                      <MediaQuery query='(max-device-width: 767px)'>
                        {division.divisionClasses.map((divisionClass, index) =>
                          <div key={divisionClass.id}>
                            <Divider />
                            <List subheader={divisionClass.class.title}>
                              {this.renderClassTeachers(divisionClass).map((teacherDay, index) =>
                                <ListItem
                                  key={teacherDay.day.day}
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
                                        key={1}
                                        primaryText={teacher.person.firstName+" "+teacher.person.lastName}
                                        leftIcon={
                                          <ActionGrade
                                            onTouchTap={((...args)=>this.confirmTeacher(divisionClass, teacherDay, teacher, ...args))}
                                            color={(teacher.confirmed) ? Styles.Colors.deepOrange500 : Styles.Colors.grey400} />
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

Schedules.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return {
    configs: state.divisionConfigs.present
  };
}

export default connect(select)(Schedules);
