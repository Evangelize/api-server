import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import InputMask  from 'react-input-mask';
import TextField from 'material-ui/TextField';

@observer
class MaskedInput extends Component {
  render() {
    const { mask, onChange, value, ...props } = this.props;
    return (
      <TextField {...props} >
        <InputMask
          mask={mask}
          onChange={onChange}
          value={value}
        />
      </TextField>
    );
  }
}

MaskedInput.propTypes = {
  mask: PropTypes.string
};

export default MaskedInput;