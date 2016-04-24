import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
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
