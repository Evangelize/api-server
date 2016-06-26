import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import NavgiationApps from 'material-ui/svg-icons/navigation/apps';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-bootstrap';

@connect
class Class extends Component {

  constructor(props, context) {
    super(props, context);
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  componentWillMount() {
    //const { classes } = this.context.state;
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }
  
  render() {
    const { item } = this.props;

    return (
      <div
        key={item.id} >
        <Divider />
        <ListItem
            onTouchTap={((...args)=>this.navigate("/classes/"+item.id, ...args))}
            primaryText={item.title}
        />
      </div>
    );
  }
}
export default Class;
