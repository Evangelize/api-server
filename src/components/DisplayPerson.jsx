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
    const { person, badge } = this.props;
    const personPhoto = (person.photoUrl && person.photoUrl.length);
    const familyPhoto = (this.family && this.family.photoUrl && this.family.photoUrl.length);
    let CustomAvatar = <Avatar>{person.firstName.charAt(0)}</Avatar>;
    if (personPhoto) {
      CustomAvatar = <Avatar src={person.photoUrl} />;
    } else if (familyPhoto) {
      CustomAvatar = <Avatar src={this.family.photoUrl} />;
    }
    CustomAvatar = (badge) ? badge(person, CustomAvatar) : CustomAvatar;
    return CustomAvatar;
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (e, obj) => {
    e.preventDefault();
    const { person, onTap } = this.props;
    onTap(obj.props.children.toLowerCase(), person);
  }

  render() {
    const { 
      person,
      secondaryText,
      secondaryTextLines,
      rightAvatar,
      rightMenuItems
    } = this.props;
    const avatar = this.displayPhoto();
    const rightIconButton = (rightMenuItems) ? 
      <IconMenu
        iconButtonElement={iconButtonElement}
        onItemTouchTap={this.handleTap}
        onTouchTap={this.handleMenuTap}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {rightMenuItems.map((item, index) =>
          <MenuItem key={index}>{item}</MenuItem>
        )}
      </IconMenu> : null;
    return (
      <div key={person.id}>
        <ListItem
          primaryText={`${person.firstName} ${person.lastName}`}
          secondaryText={secondaryText}
          secondaryTextLines={secondaryTextLines}
          leftAvatar={avatar}
          rightAvatar={(rightAvatar) ? rightAvatar(person) : null}
          rightIconButton={rightIconButton}
        />
        <Divider />
      </div>
    );
  }
}
export default DisplayPerson;
