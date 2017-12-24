import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DisplayWorshipAttendance from '../../components/DisplayWorshipAttendance';

@inject('worship')
@observer
export default class extends Component {
  render() {
    const { worship, params } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Edit Attendance" goBackTo="/worship/attendance" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <DisplayWorshipAttendance
                worshipDate={parseInt(params.date, 10)}
                service={worship.getService(params.id)}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
