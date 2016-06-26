
import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';

class UncontrolledTextInput extends Component
{
    constructor (props)
    {
        super (props);
        this.shouldSetInputTextToDefaultValue = this.shouldSetInputTextToDefaultValue.bind (this); // bind method's 'this' to the instance
    }

    shouldSetInputTextToDefaultValue (props)
    {
        var result =
            this.previousDefaultText        != props.initialValue ||
            this.previousChangeIndicator    != props.changeIndicator;
        return result;
    }
    
    componentWillMount() {
        console.log("value", this.props.initialValue);
        this.setState({
            value: this.props.initialValue
        });
    }
    
    update(e) {
        this.setState({
            value: e.target.value
        });
    }

    render ()
    {
        var result = (
                <TextField
                    {...this.props}
                    ref = "textInput"
                    value = {this.state.value}
                    onChange = {((...args)=>this.update(...args))}
                />
        );
        return result;
    }
};

// Component signature (props)

UncontrolledTextInput.propTypes =
{
    initialValue:       React.PropTypes.any,                // Default input text field value, written when it changes or when the changeIndicator changes.  Note - .isRequired fails for an unknown reason
    changeIndicator:    React.PropTypes.any,                // Optional indicator, which on change triggers a write of defaultText to the text input field
    onBlur:             React.PropTypes.func.isRequired,    // Method to capture user-edited value on exit from field
    inputProps:         React.PropTypes.any                 // attributes you want to pass to the input text element, for example {{className = "'form-control'"}}
};

export default UncontrolledTextInput;