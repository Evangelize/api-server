import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Styles from 'material-ui/lib/styles';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import Toggle from 'material-ui/lib/toggle';
import { Grid, Row, Col } from 'react-bootstrap';
import { getPeople, setPerson } from '../actions';

class People extends Component {
  constructor(props, context) {
    super(props, context);
    const { dispatch } = this.props;
    this.state = {
      searchType: "lastName"
    };
  }

  _handleInputChange(e) {
    const { people, dispatch } = this.props,
          filter = e.target.value;
    if (filter.length > 1) {
      dispatch(getPeople(people.key, e.target.value));
    }
  }

  handleSelectValueChange(e, index, value) {
    const { people } = this.props;
    people.key = value;
  }

  _handlePersonToggle(e, toggle, index) {
    const { people, dispatch } = this.props,
          person = people.data[index];
    dispatch(setPerson(person.id, index, e.target.value, toggle));
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
      displaySelectAll: false
    });
  }

  componentDidMount() {

  }

  render() {
    const { searchType } = this.state;
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
    const { dispatch, people, ...props } = this.props;
           console.log(people);
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <nav className={"grey darken-1"}>
              <div className={"nav-wrapper"}>
                <div className={"col s12 m12 l12"}>
                  <a href="#!" className={"breadcrumb"}>Dashboard</a>
                  <a href="#!" className={"breadcrumb"}>People</a>
                </div>
              </div>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <DashboardMedium title={"Find Members"} subtitle={"Search for members to provision as students and teachers"}>
              <Row>
                <Col xs={12} sm={12} md={3} lg={2}>
                  <DropDownMenu
                    value={searchType}
                    onChange={::this.handleSelectValueChange}
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
                    defaultValue={people.filter}
                    onChange={::this._handleInputChange} />
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
                    {people.data.map((person, index) =>
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

People.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  console.log(state);
  return {
    people: state.people.present
  };
}

export default connect(select)(People);
