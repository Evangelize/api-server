import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import * as Colors from 'material-ui/lib/styles/colors';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import Toggle from 'material-ui/lib/toggle';
import { Grid, Row, Col } from 'react-bootstrap';

@connect(state => ({
  classes: state.classes,
  settings: state.settings
}))
@observer
class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      email: null,
      password: null
    };
  }

  componentWillMount() {

  }

  login(e) {
    const { classes, settings } = this.props;
    settings.authenticate(
      this.state.email,
      this.state.password,
      function(authenticated){
        browserHistory.push("/dashboard");
      }
    );

  }

  navigate(path, e) {
    //dispatch(updatePath(path));
  }

  handleChange(field, e) {
    if (field === "email") {
      this.setState({
        email: e.target.value,
      });
    } else if (field === "password") {
      this.setState({
        password: e.target.value,
      });
    }
  }

  render() {
    return (
      <div className="login-box">
        <div className="login-center">
          <div className="login">
            <div className="login-header"
                style={{
                  backgroundColor: this.state.muiTheme.rawTheme.palette.primary1Color,
                  color: this.state.muiTheme.rawTheme.palette.alternateTextColor
                }}
            >
              <div
                style={{fontSize: "45px"}}>
                Evangelize
              </div>
            </div>
            <div className="login-body">
              <TextField
                hintText="Email"
                floatingLabelText="Email"
                style={{width: "100%"}}
                value={this.state.email}
                onChange={((...args)=>this.handleChange("email", ...args))}
              /><br/>
              <TextField
                type="password"
                hintText="Password"
                floatingLabelText="Password"
                style={{width: "100%"}}
                value={this.state.password}
                onChange={((...args)=>this.handleChange("password", ...args))}
              /><br/>
              <br/>
              <RaisedButton label="Login" primary={true} onTouchTap={((...args)=>this.login(...args))} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
