import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import ListAcademicYears from '../../components/ListAcademicYears';
import DialogAcademicYear from '../../components/DialogAcademicYear';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';

@inject('classes')
@observer
class ClassGroupingAcadmicYears extends Component {
  @observable isEdit = false;
  @observable yearId;
  @observable start = moment();
  @observable end = moment();
  @observable deleteId;
  @observable dialogDeleteOpen = false;
  @observable dialogOpen = false;
  handleChange = (type, e, date) => {
    if (type === 'start') {
      this.start = moment(date);
    } else {
      this.end = moment(date);
    }
  }

  handleOpenDialog = () => {
    this.isEdit = false;
    this.yearId = null;
    this.start = moment();
    this.end = moment();
    this.dialogOpen = true;
  }

  handleClose = (type) => {
    const { classes, params } = this.props;
    const { classGroupingId } = params;
    this.dialogOpen = false;
    if (type === 'ok') {
      classes.updateClassGroupingYear(this.yearId, classGroupingId, this.start.valueOf(), this.end.valueOf());
    }
  }

  handleDeleteClose = (type) => {
    const { classes } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      classes.deleteRecord('divisionYears', this.deleteId);
    }
    this.deleteId = null;
  }

  handleTap = (type, id) => {
    const { classes } = this.props;
    if (type === 'edit') {
      const year = classes.getClassGroupingYear(id);
      this.isEdit = true;
      this.yearId = id;
      this.start = moment(year.startDate);
      this.end = moment(year.endDate);
      this.dialogOpen = true;
    } else if (type === 'delete') {
      this.deleteId = id;
      this.dialogDeleteOpen = true;
    }
  }

  render() {
    const { classes, params } = this.props;
    const { classGroupingId } = params;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel={`${classes.getDivisionConfig(classGroupingId).title}`} goBackTo="/schedule/manage">
                <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                  <RaisedButton
                    label="Add Academic Year"
                    secondary
                    onClick={this.handleOpenDialog}
                  />
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Academic Years"}
                  subtitle={`${classes.getDivisionConfig(classGroupingId).title}`}
                  avatar={<Avatar>{"AY"}</Avatar>}
                />
                <CardMedia>
                  <ListAcademicYears 
                    classGroupingId={classGroupingId} 
                    onTap={this.handleTap}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogAcademicYear
          open={this.dialogOpen}
          isEdit={this.isEdit}
          start={this.start}
          end={this.end}
          onClose={this.handleClose}
          onChange={this.handleChange}
        />
        <DialogConfirmDelete
          open={this.dialogDeleteOpen}
          onClose={this.handleDeleteClose}
        />
      </div>
    );
  }
}

export default ClassGroupingAcadmicYears;
