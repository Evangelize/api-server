import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';
import { grey400 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

@inject('worship', 'jobs')
@observer
class AssignJobs extends Component {
  @observable month = moment().format('MM');
  @observable year = moment().format('YYYY');
  @observable members = [];
  @observable dialogOpen = false;
  @observable selectedJob;
  @observable selectedDate;
  @observable selectedPerson;
  @observable selectedService;
  @observable person;

  handleSelect = (person, event, isInputChecked) => {
    if (isInputChecked) {
      this.person = person;
    }
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (job, service, date, person, e, obj) => {
    e.preventDefault();
    // const { person, onTap } = this.props;
    if (obj.props.children === 'Change') {
      this.selectedJob = job;
      this.selectedService = service;
      this.selectedDate = date;
      this.selectedPerson = person;
      this.person = person;
      this.dialogOpen = true;
    }
  }

  handleClose = (type) => {
    const { jobs } = this.props;
    this.dialogOpen = false;
    if (type === 'change') {
      jobs.updateMemberJobAssignment(this.selectedJob, this.selectedService, this.selectedDate, this.selectedPerson, this.person);
    }
  }

  changeDate = (...args) => {
    console.log(args);
    this.month = moment(args[1]).format('MM');
    this.year = moment(args[1]).format('YYYY');
  }

  render() {
    const { jobs, worship } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={((...args) => this.handleClose('cancel', ...args))}
      />,
      <FlatButton
        label="Change"
        primary
        keyboardFocused
        onTouchTap={((...args) => this.handleClose('change', ...args))}
      />,
    ];

    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={'Assign Jobs'}
                goBackTo={'/dashboard'}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <DatePicker
                hintText="Month to Assign"
                floatingLabelText="Month to Assign"
                value={moment(`${this.year}-${this.month}-01T00:00:00`).toDate()}
                onChange={((...args) => this.changeDate(...args))}
              />
            </Col>
          </Row>
          {worship.getMonthServiceDays(this.month, this.year).map((date) =>
            <Row key={date}>
              {worship.getServicesByDate(date).map((service) =>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Card>
                    <CardHeader
                      title={`${service.title}`}
                      subtitle={`${moment(date).format('MMMM Do, YYYY')}`}
                      avatar={<Avatar>{service.title.charAt(0)}</Avatar>}
                    />
                    <CardMedia>
                      <List>
                        {jobs.getWorshipServiceJobs(service.id).map((job) =>
                          <div key={job.id}>
                            <Divider />
                            <ListItem
                              primaryText={`${job.title} (${jobs.getServiceJobMembersCount(service.id, job.id, date)}/${job.numPeople})`}
                              nestedItems={jobs.getServiceJobMembers(service.id, job.id, date).map((person, idx) =>
                                <ListItem
                                  key={person.id || idx}
                                  primaryText={(person.id) ? `${person.lastName}, ${person.firstName}` : `${person.firstName}`}
                                  rightIconButton={
                                    <IconMenu
                                      iconButtonElement={iconButtonElement}
                                      onItemTouchTap={((...args) => this.handleTap(job, service, date, person, ...args))}
                                      onTouchTap={this.handleMenuTap}
                                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    >
                                      <MenuItem>Change</MenuItem>
                                    </IconMenu>
                                  }
                                />
                              )}
                            />
                          </div>
                        )}
                      </List>
                    </CardMedia>
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </Grid>
        <Dialog
          title="Change Member"
          actions={actions}
          modal={false}
          open={this.dialogOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          {this.selectedJob &&
            <List>
              {jobs.getJobMembers(this.selectedJob.id).map((person, index) =>
                <div key={person.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    leftCheckbox={
                      <Checkbox
                        checked={this.person.id === person.id}
                        onCheck={((...args) => this.handleSelect(person, ...args))}
                      />
                    }
                    primaryText={`${person.lastName}, ${person.firstName}`}
                  />
                </div>
              )}
            </List>
          }
        </Dialog>
      </div>
    );
  }
}

export default AssignJobs;
