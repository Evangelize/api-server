import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import { Grid } from 'react-bootstrap';
import RenderClassAttendance from './RenderClassAttendance';


@inject('classes')
@observer
class DisplayClassAttendance extends Component {

  componentWillMount() {
    const { classes } = this.props;
    const { divisionConfig, date } = this.props,
          dow = moment(date).weekday();

    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      divisionConfigClasses: {
        divClasses: [],
      },
      dow,
      isClassDay: classes.isClassDay(dow),
    });
  }

  render() {
    const { classes } = this.props;
    const { divisionConfig, date } = this.props;
    const { dow, isClassDay, divisionConfigClasses } = this.state;
    const divClasses = classes.getDivisionConfigClasses(divisionConfig.id, date, dow);
    let self = this;
    if (isClassDay && divClasses.length >= 1) {
      return (
        <Card>
          <CardHeader
              title={divisionConfig.title+' Attendance'}
              subtitle={moment(date).tz('America/Chicago').format('dddd MM/DD/YYYY')}
              avatar={<Avatar>{moment(date).tz('America/Chicago').format('dd')}</Avatar>}>
          </CardHeader>
          <CardMedia>
            <Grid fluid={true} key={1}>
              <RenderClassAttendance divClasses={divClasses} date={date} />
            </Grid>
          </CardMedia>
        </Card>
      );
    } else {
      return (<div />);
    }
  }
}
export default DisplayClassAttendance;
