import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import GoogleLogin from 'react-google-login';

@inject('settings', 'sockets')
@observer
class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      email: null,
      password: null,
      error: null,
    };
  }

  componentWillMount() {

  }

  login() {
    const { sockets, settings } = this.props;
    const self = this;
    self.setState({ error: null });
    settings.authenticate(
      this.state.email,
      this.state.password,
      (authenticated) => {
        if (authenticated) {
          sockets.setupWs();
          browserHistory.push('/dashboard');
        } else {
          self.setState({ error: 'Incorrect email and/or password' });
        }
      }
    );
  }

  handleChange(field, e) {
    if (field === 'email') {
      this.setState({
        email: e.target.value,
      });
    } else if (field === 'password') {
      this.setState({
        password: e.target.value,
      });
    }
  }

  responseGoogle = (response) => {
    const { sockets, settings } = this.props;
    console.log(response);
    settings.thirdPartyLogin(
      'google',
      response,
      (authenticated) => {
        if (authenticated) {
          sockets.setupWs();
          browserHistory.push('/dashboard');
        } else {
          self.setState({ error: 'Incorrect Google Login' });
        }
      }
    );
  }

  render() {
    return (
      <div className="login-box">
        <div className="login-center">
          <div className="login">
            <div className="login-header"
                style={{
                  backgroundColor: this.state.muiTheme.rawTheme.palette.primary1Color,
                  color: this.state.muiTheme.rawTheme.palette.alternateTextColor,
                  backgroundImage: 'url(/img/evangelize-logo.svg)',
                }}
            >
            </div>
            <div className="login-body">
              <GoogleLogin
                clientId="642847737907-diod4bhvk18nfn5dg7bjm6di0kpict2k.apps.googleusercontent.com"
                buttonText="Login with GOOGLE"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
              />
              <TextField
                hintText="Email"
                floatingLabelText="Email"
                type="email"
                errorText={this.state.error}
                style={{ width: '100%' }}
                value={this.state.email}
                onChange={((...args) => this.handleChange('email', ...args))}
              />
              <br />
              <TextField
                type="password"
                hintText="Password"
                floatingLabelText="Password"
                errorText={this.state.error}
                style={{ width: '100%' }}
                value={this.state.password}
                onChange={((...args) => this.handleChange('password', ...args))}
              />
              <br />
              <br />
              <RaisedButton label="Login" primary onClick={((...args) => this.login(...args))} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
