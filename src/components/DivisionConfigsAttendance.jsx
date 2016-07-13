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
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-bootstrap';
import { context, resolve } from "react-resolver";
import DisplayClassAttendance from './DisplayClassAttendance';

@connect
class DivisionConfigsAttendance extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  componentWillReact() {
    console.log("divisionConfigsAttendance:componentWillReact", moment().unix());
  }
  
  render() {
    const { divisionConfigs, date } = this.props;
    console.log("divisionConfigsAttendance:render", moment().unix());
    return (
      <Row>
        {divisionConfigs.map((divisionConfig, index) =>
          <Col xs={12} sm={12} md={12} lg={12} key={divisionConfig.id}>
            <DisplayClassAttendance date={date} divisionConfig={divisionConfig} />
          </Col>
        )}
      </Row>
    );
  }
}
export default DivisionConfigsAttendance;
