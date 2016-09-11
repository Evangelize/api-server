import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { whilst } from 'async';
import moment from 'moment-timezone';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NavgiationApps from 'material-ui/svg-icons/navigation/apps';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import DivisionClass from './DivisionClass';

const DragHandle = SortableHandle(() => <NavgiationApps />); // This can be any component you want
const SortableItem = SortableElement(({ item }) => (
  <div>
    <Divider />
    <ListItem
      primaryText={item.title}
      secondaryText={`${moment(item.start).format('MMM DD YYYY')} - ${moment(item.end).format('MMM DD YYYY')}`}
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

class SortableComponent extends Component {
  render() {
    let { items, onSortEnd } = this.props;

    return (
      <SortableList items={items} onSortEnd={onSortEnd} />
    );
  }
}


@inject('classes')
@observer
class ListDivisionClasses extends Component {
  moveItem = (dragObject, e) => {
    const { classes, yearId } = this.props;
    const sortArray = classes.getDivisionSchedulesByPosition(yearId);
    const dragItem = sortArray[dragObject.oldIndex];
    const hoverItem = sortArray[dragObject.newIndex];

    let count = 0;
    const dir = (dragObject.oldIndex > dragObject.newIndex) ? 'up' : 'down';
    whilst(
      () => count <= Math.abs(dragObject.oldIndex - dragObject.newIndex),
      (callback) => {
        let obj;
        let pos = 0;
        if (count === 0) {
          classes.updateDivisionOrder(dragItem.id, dragObject.oldIndex, dragObject.newIndex);
        } else if (dir === 'up') {
          obj = sortArray[dragObject.oldIndex - count];
          pos = parseInt(obj.position, 10);
          classes.updateDivisionOrder(obj.id, pos, pos + 1);
        } else {
          obj = sortArray[dragObject.oldIndex + count];
          pos = parseInt(obj.position, 10);
          classes.updateDivisionOrder(obj.id, pos, pos - 1);
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
    const { classes, divisionId, onTap, sortable } = this.props;
    let retVal = (
      <List>
      {classes.getCurrentDivisionClasses(divisionId).map((item) =>
        <DivisionClass key={item.id} item={item} onTap={onTap} />
      )}
      </List>
    );
    if (this.props.sortable) {
       retVal = (<SortableComponent items={classes.getCurrentDivisionClasses(divisionId)} onSortEnd={this.moveItem} />);
    }
    return retVal;
  }
}
export default ListDivisionClasses;
