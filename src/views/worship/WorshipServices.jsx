import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ListWorshipServices from '../../components/ListWorshipServices';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DialogWorshipService from '../../components/DialogWorshipService';
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

@inject('worship')
@observer
class WorshipServices extends Component {
  ts = moment();
  @observable edit = false;
  @observable deleteId = null;
  @observable dialogOpen = false;
  @observable dialogDeleteOpen = false;
  @observable sortable = false;
  @observable service = {
    id: null,
    title: null,
    day: null,
    startTime: this.ts,
    endTime: this.ts,
    createdAt: this.ts,
    updatedAt: this.ts,
  };
  handleChange = (type, e, value) => {
    if (type === 'endTime' || type === 'startTime') {
      this.service[type] = moment(value).format('hh:mm');
    } else {
      this.service[type] = value;
    }
  }

  handleOpenDialog = () => {
    const ts = moment();
    this.service = {
      id: null,
      title: null,
      day: null,
      startTime: ts,
      endTime: ts,
      createdAt: ts,
      updatedAt: ts,
    };
    this.dialogOpen = true;
  }

  handleClose = (type) => {
    const { worship, params } = this.props;
    this.dialogOpen = false;
    this.edit = false;
    if (type === 'ok') {
      worship.updateWorshipService(null, this.service, true);
    }
  }

  handleDeleteClose = (type) => {
    const { worship } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      worship.deleteRecord('worshipServices', this.deleteId);
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
      this.service = item;
      this.edit = true;
      this.dialogOpen = true;
    } else if (type === 'delete') {
      this.dialogDeleteOpen = true;
    }
  }

  render() {
    const { worship } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Worship Services" goBackTo="/dashboard">
                <ToolbarGroup key={3} style={{ float: "right" }} lastChild>
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
                    label="Add Service"
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
                  title={"Worship Services"}
                  subtitle={"All Worship Services"}
                  avatar={<Avatar>{"W"}</Avatar>}
                />
                <CardMedia>
                  <ListWorshipServices sortable={this.sortable} onTap={this.tapItem} />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogWorshipService
          open={this.dialogOpen}
          isEdit={this.edit}
          service={this.service}
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

export default WorshipServices;
