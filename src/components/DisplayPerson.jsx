import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { browserHistory } from 'react-router';
import { inject, observer } from 'mobx-react';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

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

  displayPhoto = () => {
    const { person } = this.props;
    const personPhoto = (person.photoUrl && person.photoUrl.length);
    const familyPhoto = (this.family && this.family.photoUrl && this.family.photoUrl.length);
    let val = <Avatar>{person.firstName.charAt(0)}</Avatar>;
    if (personPhoto) {
      val = <Avatar src={person.photoUrl} />;
    } else if (familyPhoto) {
      val = <Avatar src={this.family.photoUrl} />;
    } 
    return val;
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (e, obj) => {
    e.preventDefault();
    const { person, onTap } = this.props;
    if (obj.props.children === 'Delete') {
      onTap('delete', person);
    } else if (obj.props.children === 'Edit') {
      onTap('edit', person);
    }
  }

  render() {
    const { person, secondaryText, secondaryTextLines } = this.props;
    const avatar = this.displayPhoto();
    return (
      <div>
        <Divider />
        <ListItem
          key={person.id}
          primaryText={`${person.firstName} ${person.lastName}`}
          secondaryText={secondaryText}
          secondaryTextLines={secondaryTextLines}
          leftAvatar={avatar}
          rightIconButton={
            <IconMenu
              iconButtonElement={iconButtonElement}
              onItemTouchTap={this.handleTap}
              onTouchTap={this.handleManuTap}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </IconMenu>
          }
        />
      </div>
    );
  }
}
export default DisplayPerson;
