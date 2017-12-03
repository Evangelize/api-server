import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import RenderTeachers from './RenderTeachers';

@inject('classes')
@observer
class DisplayTeachers extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),

    });
  }

  render() {
    const { divisionConfig, day, date } = this.props;
    const { classes } = this.props;
    let today = day || moment().weekday();
    const divClasses = classes.getDivisionConfigClasses(divisionConfig.id, date, today);
    let retVal = (
      <Card>
        <CardHeader
          title={`${divisionConfig.title} Teachers`}
          subtitle={moment().tz('America/Chicago').format('dddd')}
          avatar={<Avatar>T</Avatar>}
        />
        <Divider />
        <CardMedia>
        {divClasses.map((divClass) =>
          <RenderTeachers key={divClass.id} divClass={divClass} day={today} />
        )}
        </CardMedia>
      </Card>
    );
    retVal = (divClasses.length === 0) ? <div /> : retVal;
    return retVal;
  }
}
export default DisplayTeachers;
