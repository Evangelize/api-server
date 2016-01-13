import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import AppBar from 'material-ui/lib/app-bar';
import AppCanvas from 'material-ui/lib/app-canvas';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Menu from 'material-ui/lib/menu/menu';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import CustomColors from '../components/CustomColors';
import Colors from 'material-ui/lib/styles/colors';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import LeftNav from 'material-ui/lib/left-nav';
import { getPeople } from '../actions';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: ThemeManager.getMuiTheme(CustomColors),
      open: false
    };
    const { dispatch } = this.props;
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  handleLeftNavChange = function(url, e) {
    const { dispatch } = this.props;
    this.setState({open: !this.state.open});
    dispatch(updatePath(url));
  }

  showLeftNavClick = function(e) {
    this.setState({open: !this.state.open});
  }

  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props,
          { open } = this.state,
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

    return (
      <AppCanvas>
        <div>
          <AppBar
            title="Classes"
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
            open={this.state.open}
            onRequestChange={open => this.setState({open})}
          >
            <div
              style={navHeader}>
              <div style={{fontSize: "2em", margin: '0 0.5em 0.5em 0', display: "flex"}}>
                Matthew Voss
              </div>
            </div>
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/dashboard", ...args))} value={"/dashboard"} primaryText="Dashboard" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/attendance", ...args))} value={"/attendance"} primaryText="Attendance" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/classes", ...args))} value={"/classes"} primaryText="Classes" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/teachers", ...args))} value={"/teachers"} primaryText="Teachers" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/schedules", ...args))} value={"/schedules"} primaryText="Schedules" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/people", ...args))} value={"/people"} primaryText="People and Students" />
            <MenuItem onTouchTap={((...args)=>this.handleLeftNavChange("/options", ...args))} value={"/options"} primaryText="Options" />
          </LeftNav>
        </div>
        {this.props.children}
      </AppCanvas>
    );
  }
}

App.contextTypes = {
  store: React.PropTypes.object.isRequired
};

App.childContextTypes = {
  muiTheme: PropTypes.object
};

export default connect()(App);
