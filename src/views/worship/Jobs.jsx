import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable, extendObservable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ListJobs from '../../components/ListJobs';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DialogJob from '../../components/DialogJob';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  toggle: {

  },
};

@inject('jobs')
@observer
class Jobs extends Component {
  ts = moment();
  @observable edit = false;
  @observable deleteId = null;
  @observable dialogOpen = false;
  @observable dialogDeleteOpen = false;
  @observable sortable = false;
  @observable job = {
    id: null,
    title: '',
    active: true,
    priority: 100,
    numPeople: 1,
    confirm: true,
    ignore: false,
    duration: null,
    createdAt: this.ts,
    updatedAt: this.ts,
  };
  handleChange = (type, e, value) => {
    if (type === 'endTime' || type === 'startTime') {
      this.job[type] = moment(value).format('HH:mm');
    } else {
      this.job[type] = value;
    }
  }

  handleOpenDialog = () => {
    const ts = moment();
    this.job = {
      id: null,
      title: '',
      active: true,
      priority: 100,
      numPeople: 1,
      confirm: true,
      ignore: false,
      duration: null,
      createdAt: ts,
      updatedAt: ts,
    };
    this.dialogOpen = true;
  }

  handleClose = (type) => {
    const { jobs, params } = this.props;
    this.dialogOpen = false;
    this.edit = false;
    if (type === 'ok') {
      jobs.updateJob(null, this.job, true);
    }
  }

  handleDeleteClose = (type) => {
    const { jobs } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      jobs.deleteRecord('jobs', this.deleteId);
    }
    this.deleteId = null;
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  toggleSortable = () => {
    this.sortable = !this.sortable;
  }

  tapItem = (type, item) => {
    if (type === 'edit') {
      this.job = item;
      this.edit = true;
      this.dialogOpen = true;
    } else if (type === 'delete') {
      this.dialogDeleteOpen = true;
    } else if (type === 'associate') {
      this.navigate(`/worship/jobs/${item.id}/members`);
    }
  }

  render() {
    const { jobs } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Jobs" goBackTo="/dashboard">
                <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Toggle
                      label="Sortable"
                      labelPosition="right"
                      style={styles.toggle}
                      onToggle={((...args) => this.toggleSortable(...args))}
                      toggled={this.sortable}
                    />
                  </div>
                  <RaisedButton
                    label="Add Job"
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
                  title={'Jobs'}
                  subtitle={'All Jobs'}
                  avatar={<Avatar>{'J'}</Avatar>}
                />
                <CardMedia>
                  <ListJobs sortable={this.sortable} onTap={this.tapItem} />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogJob
          open={this.dialogOpen}
          isEdit={this.edit}
          job={this.job}
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

export default Jobs;
