const isBrowser = typeof window !== 'undefined';
const ReactSocialLoginButtons = isBrowser ? require('react-social-login-buttons') : undefined;
const GoogleLoginButton = isBrowser ? ReactSocialLoginButtons.GoogleLoginButton : undefined;
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';



@inject('auth', 'settings', 'sockets')
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

  async socialLogin(type) {
    let link;
    this.error = null;
    const { auth, sockets, settings } = this.props;
    const result = await auth.login(type);
    if (result.error && result.error.code === 'auth/account-exists-with-different-credential') {
      link = await result.results.user.linkWithCredential(result.error.credential);
      this.providers = result.providers;
    } else if (result.error) {
      this.error = result.error;
      this.providers = result.providers;
      this.loginButtonText = `Login with ${result.result.providers[0]}`;
      this.open = true;
    }
    console.log(result.result);
    if (!result.error) {
      sockets.setupWs();
      browserHistory.push('/dashboard');
    }
  }

  login() {
    const { auth, sockets, settings } = this.props;
    const self = this;
    self.setState({ error: null });
    auth.authenticate(
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
    const { auth, sockets, settings } = this.props;
    console.log(response);
    auth.thirdPartyLogin(
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
              {isBrowser ?
                <GoogleLoginButton
                  onClick={((...args) => this.socialLogin('google', ...args))}
                /> : null
              }
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
