import React, { Component, PropTypes } from 'react';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/lib/app-bar';
import AppCanvas from 'material-ui/lib/app-canvas';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Menu from 'material-ui/lib/menus/menu';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import CustomColors from '../components/CustomColors';
import * as Colors from 'material-ui/lib/styles/colors';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import LeftNav from 'material-ui/lib/left-nav';

@connect(state => ({
  classes: state.classes,
  settings: state.settings
}))
@observer
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: getMuiTheme(CustomColors),
      open: false,
      name: (props.settings.user) ? props.settings.user.firstName+" "+props.settings.user.lastName : ""
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
    console.log("handleLeftNavChange");
    this.setState({open: false});
    browserHistory.push(url);
  }

  showLeftNavClick(e) {
    console.log("showLeftNavClick", e);
    this.setState({open: true});
  }

  render() {
    const { settings } = this.props,
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
      <AppCanvas>
        <div style={{display: (settings.authenticated) ? "block": "none"}}>
          <AppBar
            title="Evangelize"
            iconElementLeft={<IconButton onTouchTap={::this.showLeftNavClick}><NavigationMenu /></IconButton>}>
            <div style={brandingStyle}>
              <h6>Twin City church of Christ</h6>
            </div>
          </AppBar>
        </div>
        <div>
          <LeftNav
            ref="leftNav"
            docked={false}
            disableSwipeToOpen={true}
            open={this.state.open}
            onRequestChange={open => this.setState({open})}
          >
            <div
              style={navHeader}>
              <div className="navName">
                {this.state.name}
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
          </LeftNav>
        </div>
        {this.props.children}
      </AppCanvas>
    );
  }
}

/*
App.contextTypes = {
  store: React.PropTypes.object.isRequired
};
*/
export default App;
