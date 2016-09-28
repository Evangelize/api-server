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
const Person = inject('classes')(observer(({ classes, person, actions }) =>
  <ListItem
    key={person.id}
    primaryText={`${person.lastName}, ${person.firstName}`}
    rightIconButton={
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem style={(person.id) ? null : { display: 'none' }} onClick={((...args) => actions(person, 'delete', ...args))}>Delete</MenuItem>
      </IconMenu>
    }
  />
));
const ListStudents = inject('classes')(observer(({ classes, students, actions }) =>
  <List>
    {students.map((person, index) =>
      <Person person={person} actions={actions} />
    )}
  </List>
));

@inject('classes')
@observer
class AddClassStudents extends Component {
  @observable class;
  @observable year;
  @observable searchType = 'lastName';
  @observable people = [];

  componentWillMount() {
    const { classes, params } = this.props;
    this.class = classes.getClass(params.classId);
    this.year = classes.getClassGroupingYear(params.yearId);
  }

  handleInputChange = (e) => {
    const self = this;
    const { classes } = this.props;
    const filter = e.target.value;
    if (filter.length > 1) {
      self.people = classes.findPeople(filter, self.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;
  }

  menuItemTap = (person, item, event) => {
    let opts;
    const { classes, params } = this.props;

    switch (item) {
    case 'add':
      classes.updateClassYearStudent(params.classId, params.yearId, person.id);
      break;
    case 'delete':
      let student = classes.getClassYearStudent(params.classId, params.yearId, person.id); 
      classes.deleteRecord('yearClassStudents', student.id);
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
            <NavToolBar navLabel="Add Students" goBackTo={`/classes/${params.classId}`} />
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
                title={this.class.title}
                subtitle={`AY ${moment(this.year.endDate).format('YYYY')}`}
                avatar={<Avatar>S</Avatar>}
              />
              <CardMedia>
                <ListStudents actions={this.menuItemTap} students={classes.getClassYearStudents(params.classId, params.yearId)} />
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
                    />
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
export default AddClassStudents;
