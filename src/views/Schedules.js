import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment';
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
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import DropDownIcon from 'material-ui/lib/drop-down-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menu/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import { getDivisionsConfigs } from '../actions';

class Schedules extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
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
      academicYear: 0,
      divisionConfig: 0,
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

  selectedYear(event, selectedIndex, menuItem) {
    this.setState({academicYear: selectedIndex});
    //console.log(menuItem);
  }

  selectedDivisionConfig(event, selectedIndex, menuItem) {
    this.setState({divisionConfig: selectedIndex});
    //console.log(menuItem);
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
    const { configs } = this.props;
    let days = configs.data[this.state.divisionConfig].classMeetingDays,
        classTeachers = [];
    //console.log(divClass);
    days.forEach(function(day, index){
      let results = _.where(divClass.divisionClassTeachers, {day: day.day});
      if (results.length) {
        classTeachers.push({
          day: day,
          teachers: results
        });
      } else {
        classTeachers.push({
          day: day,
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
    this.refs.snackbar.show();
  }

  handleSnackbarAction(e) {
    const { dispatch } = this.props;
    let { divisionConfig, academicYear} = this.state,
        { teacher, divClass } = this.refs.snackbar.state,
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionId + "/" + divClass.id+ "/" + teacher.day;
    dispatch(updatePath(path));
  }

  render() {
    const { dispatch, configs, years, ...props } = this.props;
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
      <div className={"mdl-grid"}>
        <Snackbar
          ref="snackbar"
          message={this.state.snackBar.message}
          action={this.state.snackBar.action}
          autoHideDuration={this.state.snackBar.autoHideDuration}
          onActionTouchTap={::this.handleSnackbarAction}/>
        <div className={"mdl-cell mdl-cell--11-col-desktop mdl-cell--3-col-phone"}>
          <div className={"mdl-typography--title-color-contrast"} style={{opacity: ".57", marginTop: "12px"}}>Schedules</div>
        </div>
        <div className={"mdl-cell mdl-cell--1-col-desktop mdl-cell--1-col-phone"} className={"visible-xs"}>
          <IconMenu style={iconMenuStyle} iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }>
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        </div>
        <div className={"mdl-cell mdl-cell--12-col"}>
          <Toolbar>
            <ToolbarGroup key={0} float="left">
              <DropDownMenu ref="divisionConfig" menuItems={configs.data} valueMember={'id'} displayMember={'title'} onChange={::this.selectedDivisionConfig} style={{marginRight: "12px"}} />
              <DropDownMenu ref="academicYear" menuItems={::this.formatYears()} valueMember={'id'} displayMember={'year'} selectedIndex={this.state.academicYear} onChange={::this.selectedYear} style={{marginRight: "12px"}} />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right" className={"hidden-xs"}>
              <ToolbarTitle text="Options" />
              <FontIcon className="mui-icon-sort" />
              <DropDownIcon iconClassName="icon-navigation-expand-more" menuItems={iconMenuItems} />
              <ToolbarSeparator />
              <RaisedButton label="New Schedule" primary={true} />
            </ToolbarGroup>
          </Toolbar>
        </div>
        <div className={"mdl-cell mdl-cell--12-col"}>
          <Slider {...settings}>
            {configs.data[this.state.divisionConfig].divisionYears[this.state.academicYear].divisions.map((division, index) =>
            <div key={division.id}>
              <div style={{margin: "10px"}}>
                <Card>
                  <CardHeader
                    title={division.title}
                    subtitle={this.formatDateRange(division)}
                    avatar={<Avatar>Q{index+1}</Avatar>}>
                      <IconMenu style={iconMenuStyle}
                        iconButtonElement={
                          <IconButton><MoreVertIcon /></IconButton>
                        }
                      >
                        <MenuItem primaryText="Edit" />
                      </IconMenu>
                  </CardHeader>
                  <CardMedia>
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
                          {configs.data[this.state.divisionConfig].classMeetingDays.map((day, index) =>
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
                              <div className={"mdl-typography--subhead"}><a href="">{divisionClass.class.title}</a></div>
                              <div className={"mdl-typography--caption-color-contrast"}>{divisionClass.class.description}</div>
                            </TableRowColumn>
                            {this.renderClassTeachers(divisionClass).map((teacherDay, index) =>
                              <TableRowColumn key={teacherDay.day.day}>{teacherDay.teachers.map((teacher, index) =>
                                <FlatButton key={teacher.id} label={teacher.person.firstName+" "+teacher.person.lastName} secondary={true} onTouchTap={(...args) =>this.handleTeacherTouchTap(teacher, divisionClass, ...args)} labelPosition="after"><FontIcon style={(teacher.confirmed) ? {fontSize: "12px", color: Styles.Colors.green500} : {display: 'none'}} className="material-icons">check_circle</FontIcon></FlatButton>
                              )}
                              </TableRowColumn>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardMedia>
                </Card>
              </div>
            </div>
            )}

          </Slider>
        </div>
      </div>
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
