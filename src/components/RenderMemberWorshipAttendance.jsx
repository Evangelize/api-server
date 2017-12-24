import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';
import { Row } from 'react-bootstrap';
import ClassAttendance from './ClassAttendance';

@inject('worship')
@observer
export default class extends Component {
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
