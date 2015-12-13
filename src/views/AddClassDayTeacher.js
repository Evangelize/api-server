import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment';
import spahql from 'spahql';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import { ActionCreators } from 'redux-undo';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Slider from 'react-slick';
import Styles from 'material-ui/lib/styles';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/lists/list-divider';
import ListItem from 'material-ui/lib/lists/list-item';
import CheckCircle from 'material-ui/lib/svg-icons/action/check-circle';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
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
import { manageDivisionClassTeacher, getPeople } from '../actions';

class AddClassDayTeacher extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { configs, params } = this.props;

    let db = spahql.db(configs.data),
      config = db.select("/"+params.divisionConfigId),
      classDay = config.select("/classMeetingDays/*[/day == "+parseInt(params.day,10)+"]"),
      year = config.select("/divisionYears/"+parseInt(params.yearId,10)),
      division = year.select("/divisions/*[/id == "+parseInt(params.divisionId,10)+"]"),
      divClass = division.select("/divisionClasses/*[/id == "+parseInt(params.classId,10)+"]");

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
      snackBar: {
        autoHideDuration: 2500,
        message: "No teacher selected",
        action: "Add Teacher",
        selectedItem: null
      },
      spahql: spahql,
      config: config.value(),
      classDay: classDay.value(),
      year: year.value(),
      division: division.value(),
      divClassPath: divClass.paths()[0],
      divClass: divClass.value()
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  formatYears() {
    const { configs } = this.props;
    let years = configs.data[this.state.divisionConfig].divisionYears;
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

  renderClassTeachers() {
    const { configs, params } = this.props;
    const { divClassPath } = this.state;
    let classTeachers = [],
        db = spahql.db(configs.data),
        divClass = db.select(divClassPath).value();
    let results = _.where(divClass.divisionClassTeachers, {day: parseInt(params.day,10)});
    return results;
  }

  renderPeople() {
    const { configs, params, people } = this.props;
    const { divClassPath } = this.state;
    let classTeachers = [],
        db = spahql.db(configs.data),
        divClass = db.select(divClassPath).value();
    let results = people.data.filter(function(person, index, array){
      return !_.where(divClass.divisionClassTeachers, {peopleId: person.id}).length;
    });
    return results;
  }

  handleTeacherTouchTap(teacher, divisionClass, e, el) {
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
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionId + "/" + divClass.id+ "/" + divClass.day.day;
    dispatch(updatePath(path));
  }

  _handleInputChange(e) {
    const { people, dispatch } = this.props,
          filter = e.target.value;
    if (filter.length > 1) {
      dispatch(getPeople(people.key, e.target.value));
    }
  }

  _handleSelectValueChange(e) {
    const { people } = this.props;
    people.key = e.target.value;
  }

  menuItemTap(person, item, event) {
    const { dispatch, params, configs } = this.props;
    const { config, classDay, year, division, divClassPath } = this.state;
    let db = spahql.db(configs.data),
        divClass = db.select(divClassPath).value(),
        opts;
    switch (item) {
      case "confirm":
        opts = {confirmed: true};
        break;
      case "unconfirm":
        opts = {confirmed: false};
        break;
      default:
        opts = null;
        break;
    };
    dispatch(
      manageDivisionClassTeacher(
        item,
        config.id,
        year.id,
        division.id,
        divClass.id,
        classDay.day,
        person.id,
        opts
      )
    );
  }

  render() {
    const { dispatch, params, configs, people, ...props } = this.props;
    const { spahql, config, classDay, year, division, divClassPath } = this.state;
    let db = spahql.db(configs.data),
        divClass = db.select(divClassPath).value(),
        iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        },
        dropDownStyle = {
          marginTop: "15px"
        },
        menuItems = [
           { payload: 'lastName', text: 'Last Name' },
           { payload: 'firstName', text: 'First Name' },
           { payload: 'emailAddress', text: 'Email' }
        ],
        iconButtonElement = (
          <IconButton
            touch={true}
            tooltip="more"
            tooltipPosition="bottom-left">
            <MoreVertIcon color={Styles.Colors.grey400} />
          </IconButton>
        ),
        rightIconMenu = (
          <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem>Reply</MenuItem>
            <MenuItem>Forward</MenuItem>
            <MenuItem>Delete</MenuItem>
          </IconMenu>
        );
    return (
      <div className={"mdl-grid"}>
        <Snackbar
          ref="snackbar"
          message={this.state.snackBar.message}
          action={this.state.snackBar.action}
          autoHideDuration={this.state.snackBar.autoHideDuration}
          onActionTouchTap={::this.handleSnackbarAction}/>
        <div className={"mdl-cell mdl-cell--12-col-desktop mdl-cell mdl-cell--8-col-tablet mdl-cell--4-col-phone"}>
          <div className={"mdl-typography--title-color-contrast"} style={{opacity: ".57", marginTop: "12px"}}>Manage Teacher(s)</div>
          <div className={"mdl-typography--menu-color-contrast"} style={{opacity: ".57", marginTop: "4px"}}>{config.academicYearTitle} {moment(year.endDate).format("YYYY")} &raquo; {divClass.class.title} &raquo; {division.title} &raquo; {moment().isoWeekday(classDay.day).format("dddd")}</div>
        </div>
        <div className={"mdl-cell mdl-cell--2-col-desktop mdl-cell mdl-cell--3-col-tablet mdl-cell--4-col-phone"}>
          <DropDownMenu
            onChange={::this._handleSelectValueChange}
            style={dropDownStyle}
            menuItems={menuItems} />
        </div>
        <div className={"mdl-cell mdl-cell--10-col-desktop mdl-cell--5-col-tablet mdl-cell--4-col-phone"}>
          <TextField
            ref="searchField"
            floatingLabelText="Search"
            style={{paddingLeft: "24px"}}
            onChange={::this._handleInputChange} />
        </div>
        <div className={"mdl-cell mdl-cell--12-col"}>
          <List subheader="Assigned">
            {this.renderClassTeachers().map((teacher, index) =>
              <ListItem
                key={teacher.id}
                leftIcon={(teacher.confirmed) ? <CheckCircle color={Styles.Colors.green500} /> : null}
                rightIconButton={
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem style={(teacher.confirmed) ? null : {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'unconfirm', ...args))}>Unconfirm</MenuItem>
                    <MenuItem style={(!teacher.confirmed) ? null : {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'confirm', ...args))}>Confirm</MenuItem>
                    <MenuItem style={(teacher.id) ? null: {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'delete', ...args))}>Delete</MenuItem>
                  </IconMenu>
                }
                primaryText={teacher.person.lastName+', '+teacher.person.firstName} >
              </ListItem>

            )}
          </List>
          <List>
            {this.renderPeople().map((person, index) =>
              <ListItem
                key={person.id}
                rightIconButton={
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={((...args)=>this.menuItemTap(person, 'add', ...args))}>Add</MenuItem>
                  </IconMenu>
                }
                primaryText={person.lastName+', '+person.firstName} >
              </ListItem>
            )}
          </List>
        </div>
      </div>
    );
  }
}

AddClassDayTeacher.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return {
    configs: state.divisionConfigs.present,
    people: state.people.present
  };
}

export default connect(select)(AddClassDayTeacher);
