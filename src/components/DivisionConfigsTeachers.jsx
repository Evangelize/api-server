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
import DisplayTeachers from './DisplayTeachers';

@connect
class DivisionConfigsTeachers extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    const { classes } = this.context.state;
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  componentWillReact() {
    console.log("divisionConfigsTeachers:componentWillReact", moment().unix());
  }
  
  render() {
    const { divisionConfigs } = this.props;
    console.log("divisionConfigsTeachers:render", moment().unix());
    return (
      <Col xs={12} sm={12} md={6} lg={6}>
        {divisionConfigs.map((divisionConfig, index) =>
          
            <DisplayTeachers divisionConfig={divisionConfig} key={divisionConfig.id} />
          
        )}
      </Col>
    );
  }
}
export default DivisionConfigsTeachers;
