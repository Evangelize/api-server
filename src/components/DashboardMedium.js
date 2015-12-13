import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menu/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ChartistGraph from 'react-chartist';

class DashboardMedium extends Component {
  constructor(props, context) {
    super(props, context);
  }

  resize() {
    _.throttle(() => {
      /**
      const graphDiv = this.refs.graphDiv;
      console.log(graphDiv.clientWidth);
      this.setState({
          sparklineWidth: graphDiv.offsetWidth - 40
      });
      **/
    }, 30)
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  render() {
    let iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        };
    const {
      title,
      subtitle,
      ...other,
    } = this.props;
    return (
      <Card>
        <CardHeader
          title={this.props.title}
          subtitle={this.props.subtitle}>
            <IconMenu style={iconMenuStyle} iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }>
              <MenuItem primaryText="Refresh" />
              <MenuItem primaryText="Help" />
              <MenuItem primaryText="Sign out" />
            </IconMenu>
        </CardHeader>
        <CardMedia>
          {this.props.children}
        </CardMedia>
      </Card>
    );
  }
}
export default DashboardMedium;
