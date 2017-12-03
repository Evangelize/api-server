import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { whilst } from 'async';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import * as Colors from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import NavgiationApps from 'material-ui/svg-icons/navigation/apps';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import Job from './Job';


const navigate = function (path, e) {
  browserHistory.push(path);
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

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);
const DragHandle = SortableHandle(() => <NavgiationApps />); // This can be any component you want
const SortableItem = SortableElement(({ item }) => (
  <div>
    <Divider />
    <ListItem
      primaryText={item.title}
    />
  </div>
));
const SortableList = SortableContainer(({ items }) => (
  <List>
    {items.map((item, index) =>
      <SortableItem key={`item-${item.id}`} index={index} item={item} />
    )}
  </List>
));

const SortableComponent = (observer(({ items, onSortEnd }) => 
  <SortableList items={items} onSortEnd={onSortEnd} />
));

@inject('jobs')
@observer
class ListJobs extends Component {

  constructor(props, context) {
    super(props, context);
    // console.log("ListClasses:context", context);
    this.moveItem = this.moveItem.bind(this);
  }

  moveItem = (dragObject, e) => {
    const { jobs } = this.props;
    const listItems = jobs.getJobs();
    const dragItem = listItems[dragObject.oldIndex];
    const hoverItem = listItems[dragObject.newIndex];
    console.log('moveItem', dragItem, hoverItem);

    let count = 0;
    const dir = (dragObject.oldIndex > dragObject.newIndex) ? 'up' : 'down';
    whilst(
      () => count <= Math.abs(dragObject.oldIndex - dragObject.newIndex),
      (callback) => {
        let obj;
        if (count === 0) {
          jobs.updateJobPriority(dragItem.id, dragObject.oldIndex, dragObject.newIndex);
        } else if (dir === 'up') {
          obj = listItems[dragObject.oldIndex - count];
          jobs.updateJobPriority(obj.id, obj.priority, obj.priority + 1);
        } else {
          obj = listItems[dragObject.oldIndex + count];
          jobs.updateJobPriority(obj.id, obj.priority, obj.priority - 1);
        }
        count++;
        callback(null, count);
      },
      (err, n) => {
        if (err) console.log(err);
      }
    );
  }

  render() {
    const { jobs, selected, onSelect, type, sortable, onTap } = this.props;
    let selectedItems = (selected) ? selected : [];
    let retVal = (
      <List>
      {jobs.getJobs().map((item, index) =>
        <Job
          key={item.id}
          index={index}
          item={item}
          type={type}
          onSelect={onSelect}
          selected={selectedItems.indexOf(item.id)} 
          onTap={onTap}
        />
      )}
      </List>
    );
    if (sortable) {
      retVal = (<SortableComponent items={jobs.getJobs()} onSortEnd={this.moveItem} />);
    }

    return retVal;
  }
}
export default ListJobs;
