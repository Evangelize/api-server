import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { whilst } from 'async';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NavgiationApps from 'material-ui/svg-icons/navigation/apps';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import ClassGrouping from './ClassGrouping';

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
class ListClassGroupings extends Component {
  moveItem = (dragObject, e) => {
    const { classes } = this.props;
    const sortArray = classes.getDivisionConfigs();
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
          classes.updateClassGroupingOrder(dragItem.id, dragObject.oldIndex, dragObject.newIndex);
        } else if (dir === 'up') {
          obj = sortArray[dragObject.oldIndex - count];
          pos = parseInt(obj.order, 10);
          classes.updateClassGroupingOrder(obj.id, pos, pos + 1);
        } else {
          obj = sortArray[dragObject.oldIndex + count];
          pos = parseInt(obj.order, 10);
          classes.updateClassGroupingOrder(obj.id, pos, pos - 1);
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
    const { classes, sortable } = this.props;
    let retVal = (
      <List>
      {classes.getDivisionConfigs().map((item) =>
        <ClassGrouping key={item.id} item={item} />
      )}
      </List>
    );
    if (sortable) {
      retVal = (<SortableComponent items={classes.getDivisionConfigs()} onSortEnd={this.moveItem} />);
    }
    return retVal;
  }
}
export default ListClassGroupings;
