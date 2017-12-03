import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable, extendObservable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import * as Colors from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader/Subheader';
import { List, ListItem } from 'material-ui/List';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import StarIcon from 'material-ui/svg-icons/action/stars';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Badge from 'material-ui/Badge';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';
import RenderPeople from '../../components/RenderPeople';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  toggle: {

  },
  dropDownStyle: {
    marginTop: '15px',
  },
  badge: {
    position: 'absolute',
    top: 25,
    left: 25,
  }
};

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);

@inject('jobs', 'people')
@observer
class JobMembers extends Component {
  @observable job;
  @observable people = [];
  @observable searchType = 'lastName';

  componentWillMount() {
    const { jobs, params } = this.props;
    this.job = jobs.getJob(params.id);
  }

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

  handleInputChange = (e) => {
    const { people } = this.props;
    const filter = e.target.value;
    if (filter.length > 1) {
      this.people = people.findPeople(filter, this.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;
  }

  menuItemTap = (type, person) => {
    const { jobs, params } = this.props;

    switch (type) {
    case 'confirm':
      jobs.confirmMember(true, this.job.id, person.id);
      break;
    case 'unconfirm':
      jobs.confirmMember(false, this.job.id, person.id);
      break;
    case 'add':
      jobs.addJobMember(this.job.id, person.id, true);
      break;
    case 'delete':
      jobs.deleteJobMember(this.job.id, person.id);
      break;
    default:
      break;
    }
  }

  renderBadge = (person, PersonAvatar) => {
    let val;
    if (person.job.confirmed) {
      val = (
        <div>
          <StarIcon
            style={styles.badge}
            color={Colors.greenA400}
          />
          {PersonAvatar}
        </div>
      );
    } else {
      val = PersonAvatar;
    }
    return val;
  }

  renderAvatar = (person) => {
    let val;
    if (person.job.confirmed) {
      val = (
        <Avatar icon={<StarIcon />} />
      );
    }
    return val;
  }


  render() {
    const { jobs, params } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Jobs" goBackTo="/dashboard" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={3} md={4} lg={2}>
              <DropDownMenu
                value={this.searchType}
                onChange={this.handleSelectValueChange}
                style={styles.dropDownStyle}
              >
                <MenuItem value={'lastName'} primaryText="Last Name" />
                <MenuItem value={'firstName'} primaryText="First Name" />
                <MenuItem value={'emailAddress'} primaryText="Email" />
              </DropDownMenu>
            </Col>
            <Col xs={12} sm={9} md={8} lg={10}>
              <TextField
                className={'searchBox'}
                ref="searchField"
                floatingLabelText="Search"
                defaultValue={jobs.peopleFilter}
                onChange={this.handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={this.job.title}
                  subtitle="Assign members to duty pool"
                  avatar={<Avatar>{this.job.title.charAt(0)}</Avatar>}
                />
                {this.people.length &&
                  <div>
                    <Divider />
                    <CardMedia>
                      <List>
                        <Subheader>Search Results</Subheader>
                        {this.people.map((person, index) =>
                          <div key={index}>
                            <ListItem
                              rightIconButton={
                                <IconMenu iconButtonElement={iconButtonElement}>
                                  <MenuItem
                                    onClick={((...args) => this.menuItemTap('add', person, ...args))}
                                  >
                                    Add
                                  </MenuItem>
                                </IconMenu>
                              }
                              primaryText={`${person.lastName}, ${person.firstName}`}
                            />
                            <Divider />
                          </div>
                        )}
                      </List>
                    </CardMedia>
                  </div>
                }
                <Divider />
                <CardMedia>
                  <RenderPeople
                    people={jobs.getJobMembers(params.id)}
                    badge={this.renderBadge}
                    onTap={this.menuItemTap}
                    rightMenuItems={[
                      'Confirm',
                      'Unconfirm',
                      'Delete',
                    ]}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default JobMembers;
