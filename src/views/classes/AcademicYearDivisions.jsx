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
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import ListDivisions from '../../components/ListDivisions';
import DialogDivision from '../../components/DialogDivision';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';

const styles = {
  toggle: {

  },
};


@inject('classes')
@observer
class AcadmicYearDivisions extends Component {
  @observable sortable = false;
  @observable divisionId;
  @observable title = '';
  @observable start = moment();
  @observable end = moment();
  @observable isEdit = false;
  @observable dialogOpen = false;
  @observable deleteId;
  @observable dialogDeleteOpen = false;
  handleChange = (type, e, date) => {
    if (type === 'start') {
      this.start = moment(date);
    } else if (type === 'end') {
      this.end = moment(date);
    } else {
      this.title = e.target.value;
    }
  }

  handleOpenDialog = () => {
    this.divisionId = null;
    this.isEdit = false;
    this.title = '';
    this.start = moment();
    this.end = moment();
    this.dialogOpen = true;
  }

  handleTap = (type, id) => {
    const { classes } = this.props;
    if (type === 'edit') {
      const div = classes.getDivision(id);
      this.isEdit = true;
      this.divisionId = id;
      this.title = div.title;
      this.start = moment(div.start);
      this.end = moment(div.end);
      this.dialogOpen = true;
    } else if (type === 'delete') {
      this.deleteId = id;
      this.dialogDeleteOpen = true;
    }
  }

  handleClose = (type) => {
    const { classes, params } = this.props;
    const { yearId } = params;
    const ay = classes.getClassGroupingYear(yearId);
    this.dialogOpen = false;
    if (type === 'ok') {
      const record = {
        id: this.divisionId,
        divisionConfigId: ay.divisionConfigId,
        divisionYear: yearId,
        title: this.title,
        start: this.start.valueOf(),
        end: this.end.valueOf(),
        position: classes.getDivisionSchedulesByPosition(yearId).length,
      };
      classes.updateDivision(record);
    }
  }

  handleDeleteClose = (type) => {
    const { classes } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      classes.deleteRecord('divisions', this.deleteId);
    }
    this.deleteId = null;
  }

  toggleSortable = () => {
    this.sortable = !this.sortable;
  }

  render() {
    const { classes, params } = this.props;
    const { yearId } = params;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={`AY ${moment(classes.getClassGroupingYear(yearId).endDate).format('YYYY')} Divisions`}
                goBackTo={`/schedule/${classes.getClassGroupingYear(yearId).divisionConfigId}`}
              >
                <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Toggle
                      label="Sortable"
                      labelPosition="right"
                      style={styles.toggle}
                      onToggle={this.toggleSortable}
                      toggled={this.sortable}
                    />
                  </div>
                  <RaisedButton
                    label="Add Division"
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
                  title={"Divisions"}
                  subtitle={`Academic Year ${moment(classes.getClassGroupingYear(yearId).endDate).format('YYYY')}`}
                  avatar={<Avatar>{"D"}</Avatar>}
                />
                <CardMedia>
                  <ListDivisions
                    yearId={yearId}
                    onTap={this.handleTap}
                    sortable={this.sortable}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogDivision
          open={this.dialogOpen}
          isEdit={this.isEdit}
          title={this.title}
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

export default AcadmicYearDivisions;
