import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import { Row } from 'react-bootstrap';
import ClassAttendance from './ClassAttendance';

@inject('classes')
@observer
class RenderClassAttendance extends Component {
  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  render() {
    const { divClasses, date } = this.props;
    return (
      <Row>
        {divClasses.map((divClass, index) =>
          <ClassAttendance date={date} divClass={divClass} key={divClass.id} />
        )}
      </Row>
    );
  }
}
export default RenderClassAttendance;
