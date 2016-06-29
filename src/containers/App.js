import React, { Component, PropTypes } from 'react';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import * as Colors from 'material-ui/styles/colors';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Drawer from 'material-ui/Drawer';
import {Modal} from 'react-overlays';
import MediaQuery from 'react-responsive';

@connect
class App extends Component {
  constructor(props, context) {
    super(props, context);
    console.log(context);
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      open: false,
      name: (context.state.settings.user) ? context.state.settings.user.firstName+" "+context.state.settings.user.lastName : "",
      modal: context.state.classes.isUpdating
    };
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  getChildContext() {
   return {
     muiTheme: this.state.muiTheme,
   };
 }

  handleLeftNavChange(url, e) {
    const { settings } = this.context.state;
    console.log("handleLeftNavChange");
    settings.leftNavOpen = false;
    browserHistory.push(url);
  }

  showLeftNavClick(e) {
    const { settings } = this.context.state;
    console.log("showLeftNavClick", e);
    settings.leftNavOpen = true;
  }

  leftNavState(state) {
    const { settings } = this.context.state;
    console.log("leftNavState", state.open);
    settings.leftNavOpen = state.open;
  }
  
  close() {
    this.setState({ modal: false });
  }

  render() {
    const { settings } = this.context.state,
          modalStyle = {
            position: 'fixed',
            zIndex: 1040,
            top: 0, bottom: 0, left: 0, right: 0
          },
          backdropStyle = {
            ...modalStyle,
            zIndex: 'auto',
            backgroundColor: '#000',
            opacity: 0.5
          },
          textColor = this.state.muiTheme.rawTheme.palette.alternateTextColor,
          navHeader = {
            backgroundColor: this.state.muiTheme.rawTheme.palette.primary1Color,
            height: '12em',
            color: textColor,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            backgroundSize: 'cover',
            backgroundImage: "url('/img/nav-header.jpg')"
          },
          brandingStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            color: Colors.white,
            backgroundColor: this.state.muiTheme.rawTheme.palette.accent1Color,
            padding: '0px 10px'
          };
    //console.log("settings", this.props);
    return (
      <div>
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={this.state.modal}
          onHide={this.close}
        >
          <div /> 
        </Modal>
        <div style={{display: (settings.authenticated) ? "block": "none"}}>
          <AppBar
            title="Evangelize"
            iconElementLeft={<IconButton onTouchTap={::this.showLeftNavClick}><NavigationMenu /></IconButton>}>
            <MediaQuery query='(min-device-width: 1024px)'>
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
            disableSwipeToOpen={true}
            open={settings.leftNavOpen}
          >
            <div
              style={navHeader}>
              <div className="navName">
                {settings.userFullName}
              </div>
            </div>

            <List>
              <ListItem primaryText="Dashboard" onTouchTap={((...args)=>this.handleLeftNavChange("/dashboard", ...args))} />
              <ListItem
                primaryText="Class Management"
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem
                    key={1}
                    onTouchTap={((...args)=>this.handleLeftNavChange("/attendance", ...args))}
                    primaryText="Attendance"
                  />,
                  <ListItem
                    key={2}
                    onTouchTap={((...args)=>this.handleLeftNavChange("/classes", ...args))}
                    primaryText="Classes"
                  />,
                  <ListItem
                    key={3}
                    onTouchTap={((...args)=>this.handleLeftNavChange("/teachers", ...args))}
                    primaryText="Teachers"
                  />,
                  <ListItem
                    key={4}
                    onTouchTap={((...args)=>this.handleLeftNavChange("/schedules", ...args))}
                    primaryText="Schedules"
                  />,
                ]}
              />
              <ListItem value={"/people"} primaryText="Members" onTouchTap={((...args)=>this.handleLeftNavChange("/people", ...args))} />
              <ListItem value={"/settings"} primaryText="Settings" onTouchTap={((...args)=>this.handleLeftNavChange("/settings", ...args))} />
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
