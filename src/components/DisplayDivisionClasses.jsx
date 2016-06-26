import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import List from 'material-ui/List/List';
import Avatar from 'material-ui/Avatar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import { Grid, Row, Col } from 'react-bootstrap';
import DisplayDivisionClass from './DisplayDivisionClass';

@connect
class DisplayDivisionClasses extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  render() {
    const { classes } = this.context.state;
    console.log("DisplayDivisionClasses",this.props.type );
    if (this.props.type === "table") {
      return(
        <Table
          fixedHeader={this.props.tableStyle.fixedHeader}
          fixedFooter={this.props.tableStyle.fixedFooter}
          selectable={this.props.tableStyle.selectable}
          multiSelectable={this.props.tableStyle.multiSelectable}
          onRowSelection={this._onRowSelection}>
          <TableHeader
            adjustForCheckbox={this.props.tableStyle.adjustForCheckbox}
            displaySelectAll={this.props.tableStyle.displaySelectAll}
            enableSelectAll={this.props.tableStyle.enableSelectAll}>
            <TableRow>
              <TableHeaderColumn>Class</TableHeaderColumn>
              {::classes.getDivisionMeetingDays(this.props.division.divisionConfigId).map((day, index) =>
                <TableHeaderColumn key={day.id}>{moment().isoWeekday(day.day).format("dddd")}</TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.props.tableStyle.displayRowCheckbox}
            deselectOnClickaway={this.props.tableStyle.deselectOnClickaway}
            showRowHover={this.props.tableStyle.showRowHover}
            stripedRows={this.props.tableStyle.stripedRows}>
            {this.props.classes.map((divisionClass, index) =>
              <DisplayDivisionClass class={divisionClass} type={this.props.type} />
            )}
          </TableBody>
        </Table>
      );
    } else {
      return (
        <List>
          {this.props.classes.map((divisionClass, index) =>
            <DisplayDivisionClass class={divisionClass} type={this.props.type} />
          )}
        </List>
      );
    };
  }
}
export default DisplayDivisionClasses;
