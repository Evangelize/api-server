import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';

@observer
export default class DialogWorshipService extends Component {
  render() {
    const { open, isEdit, onClose, service, onChange } = this.props;
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
        onTouchTap={((...args) => onClose('ok', ...args))}
        id="ok"
      />,
    ];

    return (
      <div>
        <Dialog
          title={`${(isEdit) ? 'Edit' : 'New'} Worship Service`}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={onClose}
        >
          <TextField
            hintText="Title"
            value={service.title}
            onChange={((...args) => onChange('title', ...args))}
            floatingLabelText={'Title'}
          />
          <br />
          <SelectField
            floatingLabelText="Day"
            value={service.day}
            onChange={((...args) => onChange('day', ...args))}
          >
            <MenuItem value={0} primaryText="Sunday" />
            <MenuItem value={1} primaryText="Monday" />
            <MenuItem value={2} primaryText="Tuesday" />
            <MenuItem value={3} primaryText="Wednesday" />
            <MenuItem value={4} primaryText="Thursday" />
            <MenuItem value={5} primaryText="Friday" />
            <MenuItem value={6} primaryText="Saturday" />
          </SelectField>
          <br />
          <TimePicker
            format="ampm"
            hintText="Start Time"
            value={moment(service.startTime, 'hh:mm:ss').toDate()}
            onChange={((...args) => onChange('startTime', ...args))}
          />
          <br />
          <TimePicker
            format="ampm"
            hintText="End Time"
            value={moment(service.endTime, 'hh:mm:ss').toDate()}
            onChange={((...args) => onChange('endTime', ...args))}
          />
        </Dialog>
      </div>
    );
  }
}