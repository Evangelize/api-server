import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

@inject('worship')
@observer
export default class extends Component {
  @observable service;
  @observable services = []
  @observable worshipDate = []

  componentWillMount() {
    const { start } = this.props;
    this.worshipDate = (start) ? start.toDate() : null;
  }

  changeDate = (e, date) => {
    const { worship, onChange } = this.props;
    onChange('date', date);
    this.worshipDate = date;
    this.services = worship.getServicesByDate(date);
  };

  changeService = (e, key, value) => {
    const { worship, onChange } = this.props;
    onChange('service', value);
    this.service = value;
  };

  render() {
    const { open, onClose, isEdit, start, onChange } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={((...args) => onClose('cancel', ...args))}
        id="cancel"
      />,
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onClick={((...args) => onClose('ok', ...args))}
        id="ok"
      />,
    ];

    return (
      <div>
        <Dialog
          title="Add Worship Service Attendance"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={onClose}
        >
          <DatePicker
            hintText="Attendance Date"
            floatingLabelText="Attendance Date"
            value={this.worshipDate}
            onChange={this.changeDate}
            firstDayOfWeek={0}
          />
          <br />
          <SelectField
            floatingLabelText="Select Worship Service"
            value={this.service}
            onChange={this.changeService}
          >
            {this.services.map((s) =>
              <MenuItem
                key={s.id}
                value={s.id}
                primaryText={s.title}
              />
            )}
          </SelectField>
        </Dialog>
      </div>
    );
  }
}