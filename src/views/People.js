import React, { Component, PropTypes } from 'react';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Styles from 'material-ui/styles';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Col } from 'react-bootstrap';
import { getPeople, setPerson } from '../actions';

@connect
class People extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchType: "lastName"
    };
  }

  _handleInputChange(e) {
    const { classes } = this.context.state,
          { searchType } = this.state,
          filter = e.target.value;
    if (filter && filter.length > 1) {
      //dispatch(getPeople(people.key, e.target.value));
      this.setState({
        filter: filter,
        people: classes.findPeople(filter, searchType)
      });
    }
  }

  handleSelectValueChange(e, index, value) {
    this.setState({
      searchType: e.target.value
    });

  }

  _handlePersonToggle(e, toggle, index) {
    const { people } = this.props,
          person = people.data[index];
    //dispatch(setPerson(person.id, index, e.target.value, toggle));
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
      filter: '',
      people: [],
      displayRowCheckbox: false,
      adjustForCheckbox: false,
      displaySelectAll: false
    });
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { searchType, people } = this.state;
    let grid = {
          className: "layout",
          isDraggable: false,
          isResizable: false,
          cols: 12,
          rowHeight: 50
        },
        dropDownStyle = {
          marginTop: "16px"
        },
        divStyle = {
          display: "flex",
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
        };
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <nav className={"grey darken-1"}>
              <div className={"nav-wrapper"}>
                <div style={{margin: "0 0.5em"}}>
                  <a href="#!" onClick={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                  <a className={"breadcrumb"}>Members</a>
                </div>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <DashboardMedium title={"Find Members"} subtitle={"Search for members"}>
              <Row>
                <Col xs={12} sm={12} md={3} lg={2}>
                  <DropDownMenu
                    value={searchType}
                    onChange={((...args)=>this.handleSelectValueChange(...args))}
                    style={dropDownStyle}>
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
                    defaultValue={this.state.filter}
                    onChange={((...args)=>this._handleInputChange(...args))} />
                </Col>
              </Row>
              <div>
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
                      <TableHeaderColumn style={{ width: "50%" }}>Name</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: "25%" }}>Teacher</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: "25%" }}>Student</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    displayRowCheckbox={this.state.displayRowCheckbox}
                    deselectOnClickaway={this.state.deselectOnClickaway}
                    showRowHover={this.state.showRowHover}
                    stripedRows={this.state.stripedRows}>
                    {people.map((person, index) =>
                      <TableRow selected={false} key={person.id}>
                        <TableRowColumn style={{ width: "50%" }}>
                          <div>{person.lastName}, {person.firstName}</div>
                          <div className={"mdl-typography--caption-color-contrast"}>{person.familyName}</div>
                        </TableRowColumn>
                        <TableRowColumn style={{ width: "25%" }}>
                          <Toggle
                            name="toggleTeacher"
                            value="teacher"
                            defaultToggled={person.teacher}
                            onToggle={(e, toggle) => ::this._handlePersonToggle(e, toggle, index)}  />
                        </TableRowColumn>
                        <TableRowColumn style={{ width: "25%" }}>
                          <Toggle
                            name="toggleStudent"
                            value="student"
                            defaultToggled={person.student}
                            onToggle={(e, toggle) => ::this._handlePersonToggle(e, toggle, index)} />
                        </TableRowColumn>
                      </TableRow>
                    )}

                  </TableBody>
                </Table>
              </div>
            </DashboardMedium>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default People;
