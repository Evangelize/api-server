import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
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
class AcademicYear extends Component {
  navigate(path, e) {
    browserHistory.push(path);
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (e, obj) => {
    e.preventDefault();
    const { item, classes, onTap, } = this.props;
    if (obj.props.children === 'Edit') {
      onTap('edit', item.id);
    } else if (obj.props.children === 'Delete') {
      onTap('delete', item.id);
    } else if (obj.props.children === 'Meeting Days') {
      this.navigate(`/schedule/academicYear/${item.id}/meetingDays`);
    }
  }

  render() {
    const { item } = this.props;

    return (
      <div>
        <Divider />
        <ListItem
          onTouchTap={((...args) => this.navigate(`/schedule/academicYear/${item.id}`, ...args))}
          primaryText={moment(item.endDate).format('YYYY')}
          rightIconButton={
            <IconMenu
              iconButtonElement={iconButtonElement}
              onItemTouchTap={this.handleTap}
              onTouchTap={this.handleManuTap}
            >
              <MenuItem>Edit</MenuItem>
              <MenuItem>Meeting Days</MenuItem>
              <MenuItem>Delete</MenuItem>
            </IconMenu>
          }
        />
      </div>
    );
  }
}
export default AcademicYear;
