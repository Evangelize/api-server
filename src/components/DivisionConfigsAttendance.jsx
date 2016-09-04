import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone';
import DisplayClassAttendance from './DisplayClassAttendance';

@inject('classes')
@observer
class DivisionConfigsAttendance extends Component {

  constructor(props, context) {
    super(props, context);

  }

  componentWillMount() {
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf()
    });
  }

  componentWillReact() {
    console.log('divisionConfigsAttendance:componentWillReact', moment().unix());
  }

  render() {
    const { divisionConfigs, date } = this.props;
    console.log('divisionConfigsAttendance:render', moment().unix());
    return (
      <Row>
        {divisionConfigs.map((divisionConfig, index) =>     
          <Col xs={12} sm={12} md={12} lg={12} key={divisionConfig.id}>
            <DisplayClassAttendance date={date} divisionConfig={divisionConfig} />
          </Col>
        )}
      </Row>
    );
  }
}
export default DivisionConfigsAttendance;
