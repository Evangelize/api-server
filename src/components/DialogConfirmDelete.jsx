import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


function DialogConfirmDelete(props) {
  const { open, onClose } = props;
  const actions = [
    <FlatButton
      label="No"
      onTouchTap={((...args) => onClose('cancel', ...args))}
      id="cancel"
    />,
    <FlatButton
      label="Yes"
      primary
      keyboardFocused
      onTouchTap={((...args) => onClose('ok', ...args))}
      id="ok"
    />,
  ];
  return (
    <div>
      <Dialog
        title={'Confirm Delete'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={((...args) => onClose('cancel', ...args))}
      >
        <span className="caption">Are you sure you want to delete this?</span>
      </Dialog>
    </div>
  );
}
export default observer(DialogConfirmDelete);