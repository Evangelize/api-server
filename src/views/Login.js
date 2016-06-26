import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import * as Colors from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import reactCookie from 'react-cookie';
import io from 'socket.io-client';
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      email: null,
      password: null,
      error: null
    };
  }

  componentWillMount() {

  }

  login(e) {
    const { classes, settings, db } = this.context.state;
    let self = this;
    self.setState({error: null});
    settings.authenticate(
      this.state.email,
      this.state.password,
      function(authenticated){
        if (authenticated) {
          let cookie = reactCookie.load('accessToken');
          let websocketUri = (window.wsUri) ? window.wsUri : "http://localhost:3002";
          //console.log("websocketUri", websocketUri);
          let wsclient = io(websocketUri, {query: 'auth_token='+cookie});
          db.setupWs(wsclient);
          settings.setupWs(wsclient);
          classes.setupWs(wsclient);
          
          browserHistory.push("/dashboard");
        } else {
          self.setState({error: "Incorrect email and/or password"});
        }
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
                type="email"
                errorText={this.state.error}
                style={{width: "100%"}}
                value={this.state.email}
                onChange={((...args)=>this.handleChange("email", ...args))}
              /><br/>
              <TextField
                type="password"
                hintText="Password"
                floatingLabelText="Password"
                errorText={this.state.error}
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
