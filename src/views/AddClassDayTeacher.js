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
import Slider from 'react-slick';
import * as Colors from 'material-ui/lib/styles/colors';
import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/divider';
import ListItem from 'material-ui/lib/lists/list-item';
import Subheader from 'material-ui/lib/Subheader/Subheader';
import CheckCircle from 'material-ui/lib/svg-icons/action/check-circle';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Divider from 'material-ui/lib/divider';
import { Grid, Row, Col } from 'react-bootstrap';
import { manageDivisionClassTeacher, getPeople } from '../actions';

@connect(state => ({
  classes: state.classes
}))
@observer
class AddClassDayTeacher extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { classes, params } = this.props;
    let divClass = classes.getDivisionClass(params.classId),
        division = classes.getDivision(divClass.divisionClass.divisionId);
    this.setState({
      divClass: divClass,
      division: division,
      searchType: "lastName",
      people: [],
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
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps);
  }

  componentDidMount() {

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
    const { classes, params } = this.props;
    const day = parseInt(params.day,10);
    let results = classes.getDivisionClassTeachers(params.classId, day);
    return results;
  }

  handleTeacherTouchTap(teacher, divisionClass, e, el) {
    this.setState({
      teacher: teacher,
      divClass: divisionClass
    })
    this.refs.snackbar.show();
  }

  handleSnackbarAction(e) {

    let { divisionConfig, academicYear} = this.state,
        { teacher, divClass } = this.refs.snackbar.state,
        path = "/schedule/" + divisionConfig + "/" + academicYear + "/" + divClass.divisionId + "/" + divClass.id+ "/" + divClass.day.day;
    browserHistory.push(path);
  }

  _handleInputChange(e) {
    const { classes } = this.props,
          filter = e.target.value;
    if (filter.length > 1) {
      this.setState(
        {people: classes.findPeople(filter, this.state.searchType)}
      );
    }
  }

  handleSelectValueChange(e, index, value) {
    const { people } = this.props;
    this.setState({
      searchType: value
    });
  }
  menuItemTap(teacher, item, event) {
    const { params, classes } = this.props;
    const { division, divClass } = this.state;
    let opts;

    switch (item) {
      case "confirm":
        classes.confirmTeacher(true, divClass.divisionClass.id, teacher.divClassTeacher.id);
        break;
      case "unconfirm":
        classes.confirmTeacher(false, divClass.divisionClass.id, teacher.divClassTeacher.id);
        break;
      case "add":
        classes.updateClassDayTeacher(divClass.divisionClass.id, parseInt(params.day, 10), teacher.id);
        break;
      case "delete":
        classes.deleteRecord("divisionClassTeachers", teacher.divClassTeacher.id);
        break;
    };
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { params, classes, ...props } = this.props;
    const { searchType } = this.state;
    //console.log("divClassPath", divClassPath);
    let iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        },
        dropDownStyle = {
          marginTop: "15px"
        },
        star = {
          color: Colors.deepOrange500
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
            <MoreVertIcon color={Colors.grey400} />
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
      <Grid fluid={true}>
         <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <nav className={"grey darken-1"}>
              <div className={"nav-wrapper"}>
                <div style={{margin: "0 0.5em"}}>
                  <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                  <a href="#!" onTouchTap={((...args)=>this.navigate("/schedules", ...args))} className={"breadcrumb"}>Schedules</a>
                  <a className={"breadcrumb"}>Edit</a>
                </div>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3} md={4} lg={2}>
            <DropDownMenu
              value={searchType}
              onChange={::this.handleSelectValueChange}
              style={dropDownStyle}>
              <MenuItem value={"lastName"} primaryText="Last Name" />
              <MenuItem value={"firstName"} primaryText="First Name" />
              <MenuItem value={"emailAddress"} primaryText="Email" />
            </DropDownMenu>
          </Col>
          <Col xs={12} sm={9} md={8} lg={10}>
            <TextField
              className={"searchBox"}
              ref="searchField"
              floatingLabelText="Search"
              defaultValue={classes.peopleFilter}
              onChange={::this._handleInputChange} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={this.state.divClass.class.title}
                subtitle={moment().isoWeekday(params.day).format("dddd") + " " + this.state.division.title + " " +  moment(this.state.division.startDate).format("YYYY")}
                avatar={<Avatar>{moment().isoWeekday(params.day).format("dd")}</Avatar>}>
              </CardHeader>
              <CardMedia>
                <List>
                  <Subheader>Assigned</Subheader>
                  {this.renderClassTeachers().map((teacher, index) =>
                    <ListItem
                      key={teacher.divClassTeacher.id}
                      primaryText={teacher.person.lastName+", "+teacher.person.firstName}
                      leftIcon={
                        <ActionGrade
                          onTouchTap={((...args)=>this.confirmTeacher(divClass, teacherDay, teacher, ...args))}
                          style={{ fill: (teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400}} />
                      }
                      rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem style={(teacher.divClassTeacher.confirmed) ? null : {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'unconfirm', ...args))}>Unconfirm</MenuItem>
                          <MenuItem style={(!teacher.divClassTeacher.confirmed) ? null : {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'confirm', ...args))}>Confirm</MenuItem>
                          <MenuItem style={(teacher.divClassTeacher.id) ? null: {display: 'none'}} onTouchTap={((...args)=>this.menuItemTap(teacher, 'delete', ...args))}>Delete</MenuItem>
                        </IconMenu>
                      }
                      primaryText={teacher.person.lastName+', '+teacher.person.firstName} >
                    </ListItem>

                  )}
                </List>
                <Divider />
                <List>
                  <Subheader>Search Results</Subheader>
                  {this.state.people.map((person, index) =>
                    <ListItem
                      key={index}
                      rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem onTouchTap={((...args)=>this.menuItemTap(person, 'add', ...args))}>Add</MenuItem>
                        </IconMenu>
                      }
                      primaryText={person.lastName+', '+person.firstName} >
                    </ListItem>
                  )}
                </List>
              </CardMedia>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default AddClassDayTeacher;
