import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { browserHistory } from 'react-router';
import { inject, observer } from 'mobx-react';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

@inject('classes')
@observer
class DisplayPerson extends Component {
  @observable family;
  componentWillMount() {
    const { person, classes } = this.props;
    this.family = classes.getFamily(person.familyId);
  }

  navigate = (path, e) => {
    browserHistory.push(path);
  }

  render() {
    const { person, secondaryText, secondaryTextLines } = this.props;
    return (
      <div>
        <Divider />
        <ListItem
          key={person.id}
          onClick={((...args) => this.navigate(`/members/${person.id}`, ...args))}
          primaryText={`${person.firstName} ${person.lastName}`}
          secondaryText={secondaryText}
          secondaryTextLines={secondaryTextLines}
          leftAvatar={
            <Avatar
              src={
              (person.photoUrl) ?
                  person.photoUrl :
                  this.family.photoUrl
              }
            >
              {
                  (person.photoUrl || this.family.photoUrl) ?
                  null :
                  person.firstName.charAt(0)
              }
            </Avatar>
          }
        />
      </div>
    );
  }
}
export default DisplayPerson;
