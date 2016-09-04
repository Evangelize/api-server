import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';


function DialogAttendance(props) {
  const { open, onClose, isEdit, start, onChange } = props;
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
        title={(isEdit) ? 'Edit Attendance' : 'New Attendance'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={((...args) => onClose('cancel', ...args))}
      >
        <DatePicker
          hintText="Attendance Date"
          floatingLabelText="Attendance Date"
          value={start.toDate()}
          onChange={((...args) => onChange('start', ...args))}
          firstDayOfWeek={0}
        />
      </Dialog>
    </div>
  );
}
export default observer(DialogAttendance);