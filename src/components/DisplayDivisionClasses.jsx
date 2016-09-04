import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import List from 'material-ui/List/List';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import DisplayDivisionClass from './DisplayDivisionClass';

@inject('classes')
@observer
class DisplayDivisionClasses extends Component {
  render() {
    const { classes } = this.props;
    const { division } = this.props;
    console.log('DisplayDivisionClasses', this.props.type);
    if (this.props.type === 'table') {
      return(
        <Table
          fixedHeader={this.props.tableStyle.fixedHeader}
          fixedFooter={this.props.tableStyle.fixedFooter}
          selectable={this.props.tableStyle.selectable}
          multiSelectable={this.props.tableStyle.multiSelectable}
          onRowSelection={this._onRowSelection}
        >
          <TableHeader
            adjustForCheckbox={this.props.tableStyle.adjustForCheckbox}
            displaySelectAll={this.props.tableStyle.displaySelectAll}
            enableSelectAll={this.props.tableStyle.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn>Class</TableHeaderColumn>
              {classes.getYearMeetingDays(division.divisionYear).map((day) =>
                <TableHeaderColumn key={day.id}>{moment().isoWeekday(day.dow).format('dddd')}</TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.props.tableStyle.displayRowCheckbox}
            deselectOnClickaway={this.props.tableStyle.deselectOnClickaway}
            showRowHover={this.props.tableStyle.showRowHover}
            stripedRows={this.props.tableStyle.stripedRows}
          >
            {classes.getCurrentDivisionClasses(division.id).map((divisionClass) =>
              <DisplayDivisionClass
                key={divisionClass.id}
                divisionClass={divisionClass}
                type={this.props.type}
                meetingDays={classes.getYearMeetingDays(division.divisionYear)}
              />
            )}
          </TableBody>
        </Table>
      );
    } else {
      return (
        <List>
          {classes.getCurrentDivisionClasses(division.id).map((divisionClass) =>
            <DisplayDivisionClass
              key={divisionClass.id}
              divisionClass={divisionClass}
              type={this.props.type}
              meetingDays={classes.getYearMeetingDays(division.divisionYear)}
            />
          )}
        </List>
      );
    };
  }
}
export default DisplayDivisionClasses;
