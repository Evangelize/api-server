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
import NumericInput from 'react-numeric-input';
import Subheader from 'material-ui/Subheader';

@observer
export default class DialogJob extends Component {
  render() {
    const { open, isEdit, onClose, job, onChange } = this.props;
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
          title={`${(isEdit) ? 'Edit' : 'New'} Job`}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={onClose}
        >
          <TextField
            fullWidth
            hintText="Title"
            value={job.title}
            onChange={((...args) => onChange('title', ...args))}
            floatingLabelText={'Title'}
          />
          <br />
          <div>
            <div style={{ color: 'rgb(33, 33, 33)', marginTop: 10 }}>Number of members to assign</div>
            <NumericInput
              min={1}
              max={15}
              value={job.numPeople}
              onChange={((...args) => onChange('numPeople', ...args))}
              mobile="auto"
            />
          </div>
          <br />
          <Toggle
            label="Active"
            toggled={job.active}
            onToggle={((...args) => onChange('active', ...args))}
          />
          <br />
          <Toggle
            label="Require confirmation"
            toggled={job.confirm}
            onToggle={((...args) => onChange('confirm', ...args))}
          />
          <br />
          <Toggle
            label="Allow assignment of other jobs simultaneously"
            toggled={job.ignore}
            onToggle={((...args) => onChange('ignore', ...args))}
          />
          <br />
          <Toggle
            label="Duration of Service"
            value={job.duration}
            onChange={((...args) => onChange('duration', ...args))}
          />
          <br />
        </Dialog>
      </div>
    );
  }
}