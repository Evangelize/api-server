import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

@inject('classes')
@observer
class DisplayTeacher extends Component {
  @observable person;
  componentWillMount() {
    const { classes, teacher } = this.props;
    this.person = classes.getPerson(teacher.peopleId);
  }

  render() {
    const { teacher, secondaryText } = this.props;
    return (
      <ListItem
        key={teacher.id}
        primaryText={`${this.person.firstName} ${this.person.lastName}`}
        secondaryText={secondaryText}
        leftAvatar={
          <Avatar
            src={
            (this.person.individualPhotoUrl) ?
                this.person.individualPhotoUrl :
                this.person.familyPhotoUrl
            }
          >
            {
                (this.person.individualPhotoUrl || this.person.familyPhotoUrl) ?
                null :
                this.person.firstName.charAt(0)
            }
          </Avatar>
        }
      />
    );
  }
}
export default DisplayTeacher;
