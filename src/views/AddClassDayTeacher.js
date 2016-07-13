import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import async from 'async';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Slider from 'react-slick';
import * as Colors from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import {List, ListItem, ListDivider} from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-bootstrap';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import NavToolBar from '../components/NavToolBar';

@connect
class AddClassDayTeacher extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { classes } = this.context.state;
    const { params } = this.props;
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
    const { classes } = this.context.state;
    const { params } = this.props;
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
    const { classes } = this.context.state,
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
    const { classes } = this.context.state;
    const { params } = this.props;
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
    const { classes } = this.context.state;
    const { params } = this.props;
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
            <NavToolBar navLabel="Assign Teachers" goBackTo="/schedules" />
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
                          onClick={((...args)=>this.confirmTeacher(divClass, teacherDay, teacher, ...args))}
                          style={{ fill: (teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400}} />
                      }
                      rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem style={(teacher.divClassTeacher.confirmed) ? null : {display: 'none'}} onClick={((...args)=>this.menuItemTap(teacher, 'unconfirm', ...args))}>Unconfirm</MenuItem>
                          <MenuItem style={(!teacher.divClassTeacher.confirmed) ? null : {display: 'none'}} onClick={((...args)=>this.menuItemTap(teacher, 'confirm', ...args))}>Confirm</MenuItem>
                          <MenuItem style={(teacher.divClassTeacher.id) ? null: {display: 'none'}} onClick={((...args)=>this.menuItemTap(teacher, 'delete', ...args))}>Delete</MenuItem>
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
                          <MenuItem onClick={((...args)=>this.menuItemTap(person, 'add', ...args))}>Add</MenuItem>
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
