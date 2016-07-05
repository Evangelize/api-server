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
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class DisplayTeacher extends Component {

  constructor(props, context) {
    super(props, context);

  }

  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  componentDidMount() {
    
  }

  render() {
    const { teacher } = this.props;
    return (
      <ListItem
          key={teacher.divClassTeacher.id}
          primaryText={teacher.person.firstName+" "+teacher.person.lastName}
          leftAvatar={
          <Avatar 
              src={
              (teacher.person.individualPhotoUrl) ? 
                  teacher.person.individualPhotoUrl : 
                  teacher.person.familyPhotoUrl
              }
              >
              {
                  (teacher.person.individualPhotoUrl || teacher.person.familyPhotoUrl) ? 
                  null : 
                  teacher.person.firstName.charAt(0)
              }
              </Avatar>
          }
      />
    );
  }
}
export default DisplayTeacher;
