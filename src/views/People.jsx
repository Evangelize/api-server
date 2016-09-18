import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import NavToolBar from '../components/NavToolBar';
import RenderPeople from '../components/RenderPeople';
import { Grid, Row, Col } from 'react-bootstrap';

@inject('classes')
@observer
class People extends Component {
  @observable people = [];
  @observable searchType = 'lastName';
  @observable filter = '';
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
      filter: '',
      people: [],
      displayRowCheckbox: false,
      adjustForCheckbox: false,
      displaySelectAll: false,
    });
  }

  handleInputChange = (e) => {
    const { classes } = this.props;
    this.filter = e.target.value;
    if (this.filter && this.filter.length > 1) {
      this.people = classes.findPeople(this.filter, this.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;

  }

  handlePersonToggle = (e, toggle, index) => {
    const { people } = this.props,
          person = people.data[index];
    //dispatch(setPerson(person.id, index, e.target.value, toggle));
  }

  navigate = (path, e) => {
    browserHistory.push(path);
  }

  render() {
    const dropDownStyle = {
      marginTop: '16px',
    };
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Members" goBackTo="/dashboard" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={3} lg={2}>
            <DropDownMenu
              value={this.searchType}
              onChange={((...args) => this.handleSelectValueChange(...args))}
              style={dropDownStyle}
            >
              <MenuItem value={"lastName"} primaryText="Last Name" />
              <MenuItem value={"firstName"} primaryText="First Name" />
              <MenuItem value={"emailAddress"} primaryText="Email" />
            </DropDownMenu>
          </Col>
          <Col xs={12} sm={12} md={9} lg={10}>
            <TextField
              className={"searchBox"}
              ref="searchField"
              floatingLabelText="Search"
              value={this.filter}
              onChange={((...args) => this.handleInputChange(...args))}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={"Members"}
                subtitle={"Search for members"}
                avatar={<Avatar>{"M"}</Avatar>}
              />
              <CardMedia>
                <RenderPeople people={this.people} />
              </CardMedia>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default People;
