import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import DisplayTeachers from './DisplayTeachers';

@inject('classes')
@observer
class DivisionConfigsTeachers extends Component {
  render() {
    const { divisionConfigs, date } = this.props;
    //console.log('divisionConfigsTeachers:render', moment().unix());
    return (
      <Col xs={12} sm={12} md={6} lg={6}>
        {divisionConfigs.map((divisionConfig, index) =>
          <DisplayTeachers divisionConfig={divisionConfig} key={divisionConfig.id} date={date} />
        )}
      </Col>
    );
  }
}
export default DivisionConfigsTeachers;
