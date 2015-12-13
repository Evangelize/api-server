import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import ReactGridLayout from 'react-grid-layout';
import Paper from 'material-ui/lib/paper';
import Styles from 'material-ui/lib/styles';
import Transitions from 'material-ui/lib/styles/transitions';
import { Sparklines, SparklinesBars } from 'react-sparklines';

class DashboardComponentSmall extends Component {

  constructor(props, context) {
    super(props, context);

  }

  resize() {
    _.throttle(() => {
      const graphDiv = this.refs.graphDiv;
      console.log(graphDiv.clientWidth);
      this.setState({
          sparklineWidth: graphDiv.offsetWidth - 40
      });
    }, 30)
  }

  componentDidMount() {
    this.setState({
      sparklineWidth: 100
    });
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
        graphDivStyle = {
          backgroundColor: Styles.Colors.cyan500,
          width: "45%",
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: "100%"
        },
        statsDivStyle = {
          padding: "10%",
          width: "35%"
        },
        iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        },
        lineChartData = {
          labels: [1, 2, 3, 4, 5, 6, 7, 8],
          series: [
            [5, 9, 7, 8, 5, 3, 5, 4]
          ]
        },
        lineChartOptions = {
          low: 0,
          showArea: true
        };
    const {
      zDepth,
      sparkLineData,
      title,
      body,
      ...other,
    } = this.props;
    return (
      <Paper zDepth={this.props.zDepth} style={this.props.style}>
        <div ref="graphDiv" style={graphDivStyle}>
          <Sparklines data={sparkLineData} width={120}>
            <SparklinesBars style={{ stroke: Styles.Colors.cyan300, strokeWidth: "1", fill: "#fff" }} height={50} />
          </Sparklines>
        </div>
        <div style={statsDivStyle}>
          <small>{title}</small>
          <p style={attendanceStyle}>{body}</p>
        </div>
      </Paper>
    );
  }
}
export default DashboardComponentSmall;
