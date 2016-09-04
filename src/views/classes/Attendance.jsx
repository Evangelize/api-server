import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DialogAttendance from '../../components/DialogAttendance';
import DatePicker from 'material-ui/DatePicker';

@inject('classes')
@observer
class Attendance extends Component {
  @observable sortable = false;
  @observable newStart = moment();
  @observable isEdit = false;
  @observable dialogOpen = false;
  @observable classGrouping;
  @observable start = moment(moment().format('YYYY-MM-01') + ' 00:00:00').subtract(3, 'month').valueOf();
  @observable end = moment(moment().format('YYYY-MM-01') + ' 00:00:00').add(1, 'month').valueOf();
  componentWillMount() {
    const { classes } = this.props;
    this.classGrouping = classes.getFirstDivisionConfig();
  }

  handleChange = (type, e, date) => {
    if (type === 'start') {
      this.newStart = moment(date);
    } 
  }

  handleOpenDialog = () => {
    this.isEdit = false;
    this.newStart = moment();
    this.dialogOpen = true;
  }

  handleEdit = (date) => {
    const { classes } = this.props;
    /*
    const div = classes.getAttendance(id);
    this.isEdit = true;
    this.start = moment(div.start);
    this.dialogOpen = true;
    */
  }

  handleClose = (type) => {
    this.dialogOpen = false;
    if (type === 'ok') {
      const path = `/attendance/${this.classGrouping.id}/${this.newStart.valueOf()}`;
      this.navigate(path);
    }
  }

  toggleSortable = () => {
    this.sortable = !this.sortable;
  }

  handleEditAttendance = (day, index, e) => {
    const path = `/attendance/${this.classGrouping.id}/${day.date}`;
    this.navigate(path);
  }

  changeDate = (type, ...args) => {
    console.log(args);
    this[type] = moment(args[1]).valueOf();
  }

  selectedDivisionConfig = (event, selectedIndex, value) => {
    const { classes } = this.props;
    this.classGrouping = classes.getDivisionConfig(value);
    // console.log(menuItem);
  }

  navigate = (path, e) => {
    browserHistory.push(path);
  }

  render() {
    const { classes } = this.props;
    console.log(moment(this.sstart).format('M/D/YYYY'), moment(this.end).format('M/D/YYYY'));
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Attendance" goBackTo="/dashboard">
              <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                <RaisedButton
                  label="Add Attendance"
                  secondary
                  onClick={this.handleOpenDialog}
                />
              </ToolbarGroup>
            </NavToolBar>
          </Col>
        </Row>
        <Row>

          <Col xs={12} sm={4} md={4} lg={4}>
            <DropDownMenu value={this.classGrouping.id} ref="divisionConfig" onChange={this.selectedDivisionConfig} style={{ marginRight: '12px' }}>
              {classes.getDivisionConfigs().map((config) =>
                <MenuItem key={config.id} value={config.id} label={config.title} primaryText={config.title} />
              )}
            </DropDownMenu>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <DatePicker
              hintText="Start Date"
              floatingLabelText="Start Date"
              value={moment(this.start).toDate()}
              onChange={((...args) => this.changeDate('start', ...args))}
            />
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <DatePicker
              hintText="End Date"
              floatingLabelText="End Date"
              value={moment(this.end).toDate()}
              onChange={((...args) => this.changeDate('end', ...args))}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={this.classGrouping.title}
                subtitle={"Daily Totals"}
                avatar={
                  <Avatar>
                    {this.classGrouping.title.charAt(0)}
                  </Avatar>
                }
              />
              <CardMedia>
                <List>
                  {classes.getDailyAttendanceByDivision(this.classGrouping.id, this.start, this.end).map((day, index) =>
                    <div key={index}>
                      <Divider />
                      <ListItem
                        key={index}
                        rightAvatar={<Avatar>{day.count}</Avatar>}
                        onClick={((...args) => this.handleEditAttendance(day, index, ...args))}
                        primaryText={moment(day.date, 'x').format('dddd')}
                        secondaryText={moment(day.date, 'x').format('MMMM Do YYYY')}
                      />
                    </div>
                  )}
                </List>
              </CardMedia>
            </Card>
            <DialogAttendance
              open={this.dialogOpen}
              isEdit={this.isEdit}
              start={this.newStart}
              onClose={this.handleClose}
              onChange={this.handleChange}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Attendance;
