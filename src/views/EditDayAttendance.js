import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../components/NavToolBar';
import DivisionConfigsAttendance from '../components/DivisionConfigsAttendance';
import { context, resolve } from "react-resolver";


@context("state")
// The `submit` prop is now a call to the router
@resolve("divisionConfigs", function({ state }) {
  return state.classes.getDivisionConfigs();
})
@connect
class EditDayAttendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { classes } = this.context.state;
    const { params } = this.props;
    this.setState({
      now: parseInt(params.date, 10),
    });
  }

  render() {
    const { classes } = this.context.state;
    const { params, divisionConfigs } = this.props,
          { now } = this.state;
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Edit Attendance" goBackTo="/attendance" />
            </Col>
          </Row>
          <DivisionConfigsAttendance divisionConfigs={divisionConfigs} date={now}/>
        </Grid>
      </div>
    );
  }
}

export default EditDayAttendance;
