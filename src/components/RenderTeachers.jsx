import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
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
import DisplayTeacher from './DisplayTeacher';
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class RenderTeachers extends Component {

  constructor(props, context) {
    super(props, context);

  }

  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      teachers: []
    });
  }

  componentDidMount() {
    const { classes } = this.context.state,
          { divClass, day } = this.props,
          divisionClassId = divClass.divisionClass.id;
    let self = this;
    classes.getDivisionClassTeachers(divisionClassId, day).then(
      function(data) {
        self.setState({
          teachers: data
        });
      }
    );
  }

  render() {
    const { divClass } = this.props;
    const { teachers } = this.state;
    return (
      <List>
        <Subheader>{divClass.class.title}</Subheader>
        {teachers.map((teacher, index) =>
          <DisplayTeacher teacher={teacher} key={teacher.id} />
        )}
      </List>
    );
  }
}
export default RenderTeachers;
