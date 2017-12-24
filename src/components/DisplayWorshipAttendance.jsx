import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import * as Colors from 'material-ui/styles/colors';
import { Grid } from 'react-bootstrap';
import RenderPeople from './RenderPeople';


@inject('worship', 'people')
@observer
export default class extends Component {

  componentWillMount() {
    const { service, worshipDate } = this.props;
  }

  badge = (custom, person) => {
    const { worship, service, worshipDate } = this.props;
    const personAttendance = worship.getPersonWorshipAttendance(worshipDate, '01000000000000000000000000000000', service.id, person.id)
    let CustomAvatar = (
      <ActionGrade
        // onClick={((...args) => this.menuItemTap(teacher, 'unconfirm', ...args))}
        style={{ fill: (personAttendance) ? Colors.deepOrange500 : Colors.grey400 }}
      />
    );
    return CustomAvatar;
  }

  menuItemTap = (type, person) => {
    const { service, params } = this.props;

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

  render() {
    const { worship, people, service, worshipDate } = this.props;
    return (
      <Card>
        <CardHeader
          title={`${service.title} Attendance`}
          subtitle={moment(worshipDate).tz('America/Chicago').format('dddd MM/DD/YYYY')}
          avatar={<Avatar>{moment(worshipDate).tz('America/Chicago').format('dd')}</Avatar>}
        />
        <CardMedia>
          <RenderPeople
            badge={this.badge}
            people={people.getCurrentMembers()}
            onTap={this.menuItemTap}
            rightMenuItems={[
              'Confirm',
              'Unconfirm',
              'Delete',
            ]}
          />
        </CardMedia>
      </Card>
    );
  }
}
