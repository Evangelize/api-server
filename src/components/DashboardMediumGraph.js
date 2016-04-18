import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ChartistGraph from 'react-chartist';

class DashboardMediumGraph extends Component {
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

  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps:mediumGraph", nextProps);
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  render() {
    let attendanceStyle = {
          margin: '0',
          lineHeight: '100%',
          fontSize: '22px',
          fontWeight: '300',
          color: '#fff'
        },
        iconMenuStyle = {
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
