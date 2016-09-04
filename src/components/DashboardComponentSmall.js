import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Paper from 'material-ui/Paper';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import { Sparklines, SparklinesBars } from 'react-sparklines';

@inject("classes")
@observer
class DashboardComponentSmall extends Component {

  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {

  }

  componentWillReact() {
    console.log("dashboardComponentSmall:componentWillReact", moment().unix());
  }

  render() {
    console.log("dashboardComponentSmall:render", moment().unix());
    let attendanceStyle = {
          backgroundColor: Colors.cyan500,
          width: "50%",
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: "100%",
          fontSize: '35px',
          fontWeight: '500',
          color: '#fff'
        },
        statsDivStyle = {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: "100%",
          padding: "0 0.5em",
          width: "50%",
          fontSize: '14px',
          color: '#fff'
        };
    const { zDepth, title, body, style } = this.props;
    return (
      <Paper zDepth={zDepth} style={style}>
        <div ref="graphDiv" style={attendanceStyle}>
          {body}
        </div>
        <div style={statsDivStyle}>
          {title}
        </div>
      </Paper>
    );
  }
}
export default DashboardComponentSmall;
