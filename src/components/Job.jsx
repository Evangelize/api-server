import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
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

@observer
class Job extends Component {
  navigate(path, e) {
    browserHistory.push(path);
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (e, obj) => {
    e.preventDefault();
    const { item, onTap } = this.props;
    if (obj.props.children === 'Delete') {
      onTap('delete', item);
    } else if (obj.props.children === 'Edit') {
      onTap('edit', item);
    } else if (obj.props.children === 'Available Members') {
      onTap('associate', item);
    }
  }

  render() {
    const { item, selected, type, onSelect } = this.props;
    let Item = (
      <ListItem
        primaryText={item.title}
        rightIconButton={
          <IconMenu
            iconButtonElement={iconButtonElement}
            onItemTouchTap={this.handleTap}
            onTouchTap={this.handleManuTap}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem>Edit</MenuItem>
            <MenuItem>Available Members</MenuItem>
            <MenuItem>Delete</MenuItem>
          </IconMenu>
        }
      />
    );
    Item = (type === 'add') ? (
      <ListItem
        leftCheckbox={
          <Checkbox
            checked={selected > -1}
            onCheck={((...args) => onSelect(item.id, ...args))}
          />
        }
        primaryText={item.title}
      />
    ) : Item;
    return (
      <div
        key={item.id}
      >
        <Divider />
        {Item}
      </div>
    );
  }
}
export default Job;
