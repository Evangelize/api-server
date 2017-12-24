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
import RenderPeople from '../../components/RenderPeople';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);

@inject('people')
@observer
export default class AddFamilyMember extends Component {
  @observable family;
  @observable division;
  @observable divisionYear;
  @observable day;
  @observable searchType = 'lastName';
  @observable people = [];
  @observable searchValue;

  componentWillMount() {
    const { people, params } = this.props;
    this.family = people.getFamily(params.id);
  }

  handleInputChange = (e) => {
    const self = this;
    const { people } = this.props;
    this.searchValue = e.target.value;
    if (this.searchValue.length > 1) {
      this.people = people.findPeople(this.searchValue, this.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;
  }

  menuItemTap = (person, item, event) => {
    let opts;
    const { people, params } = this.props;

    switch (item) {
    case 'add':
      people.addPersonToFamily(person, this.family.id);
      break;
    case 'delete':
      people.deletePersonFromFamily(person);
      break;
    default:
      break;
    }
  }

  render() {
    const { people, params } = this.props;
    const dropDownStyle = {
      marginTop: '15px',
    };
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Add Family Members" goBackTo={`/members/family/${this.family.id}`} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3} md={4} lg={2}>
            <DropDownMenu
              value={this.searchType}
              onChange={this.handleSelectValueChange}
              style={dropDownStyle}
            >
              <MenuItem value={'lastName'} primaryText="Last Name" />
              <MenuItem value={'firstName'} primaryText="First Name" />
              <MenuItem value={'emailAddress'} primaryText="Email" />
            </DropDownMenu>
          </Col>
          <Col xs={12} sm={9} md={8} lg={10}>
            <TextField
              className={'searchBox'}
              ref="searchField"
              floatingLabelText="Search"
              value={this.searchValue}
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={this.family.name}
                subtitle={this.family.familyName}
                avatar={(this.family.name) ? <Avatar>{this.family.name.charAt(0)}</Avatar> : null}
              />
              <CardMedia>
                <Subheader>Family Members</Subheader>
                <RenderPeople
                  people={people.getFamilyMembers(this.family.id)}
                  onTap={this.menuItemTap}
                  rightMenuItems={[
                    'Delete',
                  ]}
                />
                <Divider />
                <List>
                  <Subheader>Search Results</Subheader>
                  {this.people.map((person, index) =>
                    <ListItem
                      key={person.id}
                      rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                          <MenuItem onClick={((...args) => this.menuItemTap(person, 'add', ...args))}>Add</MenuItem>
                        </IconMenu>
                      }
                      primaryText={`${person.lastName}, ${person.firstName}`}
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
