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
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-bootstrap';
import RenderClassAttendance from './RenderClassAttendance';
import { context, resolve } from "react-resolver";


@connect
class DisplayClassAttendance extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    const { classes } = this.context.state;
    const { divisionConfig, date } = this.props,
          dow = moment(date).weekday();

    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      divisionConfigClasses: [],
      dow: dow,
      isClassDay: classes.isClassDay(dow)
    });
  }

  componentDidMount() {
    const { classes } = this.context.state;
    const { divisionConfig, date } = this.props;
    const { dow } = this.state;
    let self = this;
    classes.getDivisionConfigClasses(divisionConfig.id, date, dow).then(
      function(data) {
        console.log(data);
        self.setState({divisionConfigClasses: data});
      }
    );
  }
  
  render() {
    const { classes } = this.context.state;
    const { divisionConfig, date } = this.props;
    const { dow, isClassDay } = this.state;
    let self = this;
    
    return (
      <div>
        {isClassDay && this.state.divisionConfigClasses.map((attendance, index) =>
          <Card key={attendance.id}>
            <CardHeader
                title={attendance.config.title+" Attendance"}
                subtitle={moment(date).tz('America/Chicago').format("dddd MM/DD/YYYY")}
                avatar={<Avatar>{moment(date).tz('America/Chicago').format("dd")}</Avatar>}>
            </CardHeader>
            <CardMedia>
              <Grid fluid={true} key={1}>
                <RenderClassAttendance divClasses={attendance.classes} date={date} />
              </Grid>
            </CardMedia>
          </Card>
        )}
      </div>
    );
  }
}
export default DisplayClassAttendance;
