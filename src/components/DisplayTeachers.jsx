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
import waterfall from 'async/waterfall';
import RenderTeachers from './RenderTeachers';
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class DisplayTeachers extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      classes: []
    });
  }

  componentDidMount() {
    const { classes } = this.context.state;
    let self = this;
    classes.getCurrentDivisionClasses().then(
      function(data) {
        self.setState({
          classes: data
        });
      }
    );
  }
  
  getClasses() {
    const { classes } = this.context.state;
    const { divisionConfig } = this.props,
           now = moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf();
    let today = moment().weekday(),
        division = classes.getCurrentDivision(now),
        divClasses = classes.getCurrentDivisionClasses(division.id);
    return divClasses;
  }

  displayTeachers(divClass) {
    const { classes } = this.context.state,
          { now } = this.state,
          classDay = divClass.class.day,
          divisionClassId = divClass.divisionClass.id;
    let today = moment().weekday(),
        teachers = classes.getCurrentClassTeachers(divisionClassId);
    return teachers;
  }

  render() {
    const { divisionConfig, day } = this.props;
    const { classes } = this.state;
    let today = day || moment().weekday();
    return (
      <Card>
        <CardHeader
        title={divisionConfig.title + " Teachers"}
        subtitle={moment().tz("America/Chicago").format("dddd")}
        avatar={<Avatar>T</Avatar>}>
        </CardHeader>
        <CardMedia>
        {classes.map((divClass, index) =>
            <div key={index}>
              <Divider />
              <RenderTeachers key={divClass.id} divClass={divClass} day={today} />
            </div>
        )}
        </CardMedia>
      </Card>
    );
  }
}
export default DisplayTeachers;
