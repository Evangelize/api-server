import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

@observer
export default class DialogClassGrouping extends Component {
  render() {
    const { open, onOk, onCancel, title, onChange } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={onCancel}
        id="cancel"
      />,
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={onOk}
        id="ok"
      />,
    ];

    return (
      <div>
        <Dialog
          title="New Class Grouping"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={onCancel}
        >
          <TextField
            hintText="Enter class grouping name"
            value={title}
            onChange={onChange}
            floatingLabelText={'Class Grouping Name'}
          />
        </Dialog>
      </div>
    );
  }
}