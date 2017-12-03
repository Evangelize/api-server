import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import * as Colors from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);
const ListTeachers = inject('classes')(observer(({ classes, teachers, actions }) =>
  <List>
    {classes.getTeachers(teachers).map((teacher, index) =>
      <ListItem
        key={teacher.id}
        primaryText={`${teacher.lastName}, ${teacher.firstName}`}
        leftIcon={
          <ActionGrade
            onClick={((...args) => actions(teacher, 'unconfirm', ...args))}
            style={{ fill: (teacher.divClassTeacher.confirmed) ? Colors.deepOrange500 : Colors.grey400 }}
          />
        }
        rightIconButton={
          <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem style={(teacher.divClassTeacher.confirmed) ? null : { display: 'none' }} onClick={((...args) => actions(teacher, 'unconfirm', ...args))}>Unconfirm</MenuItem>
            <MenuItem style={(!teacher.divClassTeacher.confirmed) ? null : { display: 'none' }} onClick={((...args) => actions(teacher, 'confirm', ...args))}>Confirm</MenuItem>
            <MenuItem style={(teacher.divClassTeacher.id) ? null : { display: 'none' }} onClick={((...args) => actions(teacher, 'delete', ...args))}>Delete</MenuItem>
          </IconMenu>
        }
        primaryText={`${teacher.lastName}, ${teacher.firstName}`}
      />
    )}
  </List>
));

@inject('classes')
@observer
class AddClassDayTeacher extends Component {
  @observable divClass;
  @observable division;
  @observable divisionYear;
  @observable day;
  @observable searchType = 'lastName';
  @observable people = [];

  componentWillMount() {
    const { classes, params } = this.props;
    this.divClass = classes.getDivisionClass(params.classId);
    this.division = classes.getDivision(this.divClass.divisionClass.divisionId);
    this.divisionYear = classes.getClassGroupingYear(this.division.divisionYear);
    this.day = classes.getCurrentDivisionMeetingDays(this.division.divisionYear, params.day);
  }

  handleInputChange = (e) => {
    const self = this;
    const { classes } = this.props;
    const filter = e.target.value;
    if (filter.length > 1) {
      this.people = classes.findPeople(filter, self.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;
  }

  menuItemTap = (teacher, item, event) => {
    let opts;
    const { classes, params } = this.props;

    switch (item) {
    case 'confirm':
      classes.confirmTeacher(true, this.divClass.divisionClass.id, teacher.divClassTeacher.id);
      break;
    case 'unconfirm':
      classes.confirmTeacher(false, this.divClass.divisionClass.id, teacher.divClassTeacher.id);
      break;
    case 'add':
      classes.updateClassDayTeacher(this.divClass.divisionClass.id, parseInt(params.day, 10), teacher.id, this.day.id);
      break;
    case 'delete':
      classes.deleteRecord('divisionClassTeachers', teacher.divClassTeacher.id);
      break;
    default:
      break;
    }
  }

  render() {
    const { classes, params } = this.props;
    const dropDownStyle = {
      marginTop: '15px',
    };
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Assign Teachers" goBackTo="/schedules" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3} md={4} lg={2}>
            <DropDownMenu
              value={this.searchType}
              onChange={this.handleSelectValueChange}
              style={dropDownStyle}
            >
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
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={this.divClass.class.title}
                subtitle={`${moment().weekday(params.day).format('dddd')} - ${this.division.title} AY ${moment(this.divisionYear.endDate).format('YYYY')}`}
                avatar={<Avatar>{moment().weekday(params.day).format('dd')}</Avatar>}
              />
              <CardMedia>
                <ListTeachers actions={this.menuItemTap} teachers={classes.getDivisionClassTeachersByDayRaw(params.classId, parseInt(params.day, 10))} />
                <Divider />
                <List>
                  <Subheader>Search Results</Subheader>
                  {this.people.map((person, index) =>
                    <ListItem
                      key={index}
                      rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem onClick={((...args) => this.menuItemTap(person, 'add', ...args))}>Add</MenuItem>
                        </IconMenu>
                      }
                      primaryText={person.lastName + ', ' + person.firstName}
                    >
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
