import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DisplayClassAttendance from '../../components/DisplayClassAttendance';

@inject("classes")
@observer
class EditDayAttendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { classes } = this.props;
    const { params } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Edit Attendance" goBackTo="/attendance" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <DisplayClassAttendance date={parseInt(params.date, 10)} divisionConfig={classes.getDivisionConfig(params.divisionConfig)} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default EditDayAttendance;
