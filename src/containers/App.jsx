import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import * as Colors from 'material-ui/styles/colors';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import { Modal } from 'react-overlays';
import MediaQuery from 'react-responsive';

@inject('classes', 'settings')
@observer
class App extends Component {
  constructor(props, context) {
    super(props, context);
    console.log('App', context);
    const { classes, settings } = props;
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      open: false,
      name: (settings.user) ? settings.user.firstName + ' ' + settings.user.lastName : '',
      modal: classes.isUpdating,
    };
  }

  static childContextTypes = {
    muiTheme: PropTypes.object,
  }

  getChildContext() {
    return {
     muiTheme: this.state.muiTheme,
   };
  }

  handleLeftNavChange(url, e) {
    const { settings } = this.props;
    console.log('handleLeftNavChange');
    settings.leftNavOpen = false;
    browserHistory.push(url);
  }

  showLeftNavClick = (e) => {
    const { settings } = this.props;
    console.log('showLeftNavClick', e);
    settings.leftNavOpen = true;
  }

  leftNavState(state) {
    const { settings } = this.props;
    console.log('leftNavState', state.open);
    settings.leftNavOpen = state.open;
  }

  close() {
    this.setState({ modal: false });
  }

  render() {
    const { settings } = this.props;
    const modalStyle = {
      position: 'fixed',
      zIndex: 1040,
      top: 0, bottom: 0, left: 0, right: 0,
    };
    const backdropStyle = {
      zIndex: 'auto',
      backgroundColor: '#000',
      opacity: 0.5,
      ...modalStyle,
    };
    const textColor = this.state.muiTheme.rawTheme.palette.alternateTextColor;
    const navHeader = {
      backgroundColor: this.state.muiTheme.rawTheme.palette.primary1Color,
      height: '12em',
      color: textColor,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      backgroundSize: 'cover',
      backgroundImage: 'url(\'/img/nav-header.jpg\')',
    };
    const brandingStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      color: Colors.white,
      backgroundColor: this.state.muiTheme.rawTheme.palette.accent1Color,
      padding: '0px 10px',
    };
    // console.log("settings", this.props);
    return (
      <div>
        <Modal
          aria-labelledby="modal-label"
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={this.state.modal}
          onHide={this.close}
        >
          <div />
        </Modal>
        <div style={{ display: (settings.authenticated) ? 'block' : 'none' }}>
          <AppBar
            title="Evangelize"
            iconElementLeft={<IconButton onClick={this.showLeftNavClick}><NavigationMenu /></IconButton>}
          >
            <MediaQuery query="(min-device-width: 1024px)">
              <div style={brandingStyle}>
                <h6>Twin City church of Christ</h6>
              </div>
            </MediaQuery>
          </AppBar>
        </div>
        <div>
          <Drawer
            ref="leftNav"
            docked={false}
            disableSwipeToOpen
            open={settings.leftNavOpen}
          >
            <div
              style={navHeader}
            >
              <div className="navName">
                {settings.userFullName}
              </div>
            </div>

            <List>
              <ListItem
                primaryText="Dashboard"
                onClick={((...args) => this.handleLeftNavChange('/dashboard', ...args))}
              />
              <ListItem
                primaryText="Class Management"
                initiallyOpen
                primaryTogglesNestedList
                nestedItems={[
                  <ListItem
                    key={1}
                    onClick={((...args) => this.handleLeftNavChange('/attendance', ...args))}
                    primaryText="Attendance"
                  />,
                  <ListItem
                    key={2}
                    onClick={((...args) => this.handleLeftNavChange('/classes', ...args))}
                    primaryText="Classes"
                  />,
                  <ListItem
                    key={4}
                    onClick={((...args) => this.handleLeftNavChange('/schedules', ...args))}
                    primaryText="Schedules"
                  />,
                ]}
              />
              <ListItem
                primaryText="Worship Management"
                initiallyOpen
                primaryTogglesNestedList
                nestedItems={[
                  <ListItem
                    key={1}
                    onClick={((...args) => this.handleLeftNavChange('/worship/services/list', ...args))}
                    primaryText="Worship Services"
                  />,
                ]}
              />
              <ListItem
                primaryText="Member Management"
                initiallyOpen
                primaryTogglesNestedList
                nestedItems={[
                  <ListItem
                    key={1}
                    onClick={((...args) => this.handleLeftNavChange('/members', ...args))}
                    primaryText="Search/Browse"
                  />,
                  <ListItem
                    key={2}
                    onClick={((...args) => this.handleLeftNavChange('/members/families', ...args))}
                    primaryText="Manage Families"
                  />,
                  <ListItem
                    key={3}
                    onClick={((...args) => this.handleLeftNavChange('/members/import', ...args))}
                    primaryText="Import"
                  />,
                ]}
              />
              <ListItem
                value={"/settings"}
                primaryText="Settings"
                onClick={((...args) => this.handleLeftNavChange('/settings', ...args))}
              />
            </List>
          </Drawer>
        </div>
        {this.props.children}
      </div>
    );
  }
}

/*
App.contextTypes = {
  store: React.PropTypes.object.isRequired
};
*/
export default App;
