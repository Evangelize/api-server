import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
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

@connect
class DashboardMediumGraph extends Component {
  constructor(props, context) {
    super(props, context);
  }

  resize() {
  }

  componentWillReact() {
    console.log("dashboardMediumGraph:componentWillReact", moment().unix());
  }

  componentWillReceiveProps(nextProps) {
    console.log("dashboardMediumGraph:componentWillReceiveProps", moment().unix());
    //console.log("componentWillReceiveProps:mediumGraph", nextProps);
  }

  componentDidMount() {
    let self = this;
    window.addEventListener('resize', this.resize);
  }

  render() {
    console.log("dashboardMediumGraph:render", moment().unix());
    return (
      <Card>
        <CardHeader
          title={this.props.title}
          subtitle={this.props.subtitle}
          avatar={this.props.avatar}>
        </CardHeader>
        <CardMedia>
          <ChartistGraph data={this.props.lineChartData} options={this.props.lineChartOptions} type={'Line'} />
        </CardMedia>
      </Card>
    );
  }
}
export default DashboardMediumGraph;
