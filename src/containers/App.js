import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';
import AppBar from 'material-ui/lib/app-bar';
import AppCanvas from 'material-ui/lib/app-canvas';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menu/menu-item';
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
    this._showLeftNavClick = this._showLeftNavClick.bind(this);
    this.state = {
      muiTheme: ThemeManager.getMuiTheme(CustomColors)
    };
    const { dispatch } = this.props;
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props;
    const menuItems = [
      { route: '/dashboard', text: 'Dashboard' },
      { route: '/classes', text: 'Classes' },
      { route: '/teachers', text: 'Teachers' },
      { route: '/schedules', text: 'Schedules' },
      { route: '/people', text: 'People and Students' },
      { route: '/options', text: 'Options' }
    ],
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
    },
    leftNavHeader = (
      <div
        style={navHeader}>
        <div style={{fontSize: "2em", margin: '0 0.5em 0.5em 0', display: "flex"}}>
          Matthew Voss
        </div>
      </div>
    );

    return (
      <AppCanvas>
        <div>
          <AppBar
            title="Classes"
            iconElementLeft={<IconButton onTouchTap={this._showLeftNavClick}><NavigationMenu /></IconButton>}>
            <div style={brandingStyle}>
              <div className={"mdl-typography--subhead"}>Twin City church of Christ</div>
            </div>
          </AppBar>
        </div>
        <div>
          <LeftNav
            ref="leftNav"
            docked={false}
            menuItems={menuItems}
            onChange={::this.handleLeftNavChange}
            header={leftNavHeader}
          />
        </div>
        {this.props.children}
      </AppCanvas>
    );
  }

  _showLeftNavClick() {
    this.refs.leftNav.toggle();
  }

  handleLeftNavChange = function(event, selectedIndex, menuItem) {
    const { dispatch } = this.props;
    this.refs.leftNav.toggle();
    dispatch(updatePath(menuItem.route));
  }
}

App.contextTypes = {
  store: React.PropTypes.object.isRequired
};

App.childContextTypes = {
  muiTheme: PropTypes.object
};

export default connect()(App);
