import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import Toggle from 'material-ui/Toggle';
import NavToolBar from '../../components/NavToolBar';
import ListClassGroupings from '../../components/ListClassGroupings';
import DialogClassGrouping from '../../components/DialogClassGrouping';

@inject('classes')
@observer
class ClassGroupings extends Component {
  @observable sortable = false;
  @observable groupingTitle = '';
  @observable dialogOpen = false;
  handleNewGroupingChange = (e) => {
    this.groupingTitle = e.target.value;
  }

  handleOpenDialog = () => {
    this.groupingTitle = '';
    this.dialogOpen = true;
  }

  handleOk = (e) => {
    const { classes } = this.props;
    let order = classes.getDivisionConfigs().length;
    this.dialogOpen = false;
    classes.updateClassGrouping(null, this.groupingTitle, order);
  }

  handleCancel = (e) => {
    const { classes } = this.props;
    this.dialogOpen = false;
  }

  toggleSortable = () => {
    this.sortable = !this.sortable;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Class Groupings" goBackTo="/schedules">
                <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Toggle
                      label="Sortable"
                      labelPosition="right"
                      onToggle={this.toggleSortable}
                      toggled={this.sortable}
                    />
                  </div>
                  <RaisedButton
                    label="Add Class Grouping"
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
                  title={"Class Groupings"}
                  subtitle={"All class groupings"}
                  avatar={<Avatar>{"G"}</Avatar>}
                />
                <CardMedia>
                  <ListClassGroupings sortable={this.sortable} />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogClassGrouping
          open={this.dialogOpen}
          title={this.groupingTitle}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onChange={this.handleNewGroupingChange}
        />
      </div>
    );
  }
}

export default ClassGroupings;
