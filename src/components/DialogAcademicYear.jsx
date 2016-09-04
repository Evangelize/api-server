import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

@observer
export default class DialogAcademicYear extends Component {
  render() {
    const { open, onClose, isEdit, start, end, onChange } = this.props;
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
          title={(isEdit) ? 'Edit Academic Year' : 'New Academic Year'}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={((...args) => onClose('cancel', ...args))}
        >
          <DatePicker
            hintText="Start Date"
            floatingLabelText="Start Date"
            value={start.toDate()}
            onChange={((...args) => onChange('start', ...args))}
            firstDayOfWeek={0}
          />

          <DatePicker
            hintText="End Date"
            floatingLabelText="End Date"
            value={end.toDate()}
            onChange={((...args) => onChange('end', ...args))}
            firstDayOfWeek={0}
          />
        </Dialog>
      </div>
    );
  }
}