import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import moment from 'moment-timezone';
import { whilst } from 'async';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import { List, ListItem } from 'material-ui/List';
import NavgiationApps from 'material-ui/svg-icons/navigation/apps';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-bootstrap';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import Class from './Class';


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
class ListClasses extends Component {

  constructor(props, context) {
    super(props, context);
    // console.log("ListClasses:context", context);
    this.moveClass = this.moveClass.bind(this);
  }

  componentWillMount() {
    const { classes } = this.props;
    // console.log("ListClasses:willMount", context);
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
    });
  }

  moveClass = (dragObject, e) => {
    const { classes } = this.props;
    const listClasses = classes.getClasses();
    const { cards } = this.state;
    const dragClass = listClasses[dragObject.oldIndex];
    const hoverClass = listClasses[dragObject.newIndex];
    console.log('moveClass', dragClass, hoverClass);

    let count = 0;
    const dir = (dragObject.oldIndex > dragObject.newIndex) ? 'up' : 'down';
    whilst(
      () => count <= Math.abs(dragObject.oldIndex - dragObject.newIndex),
      (callback) => {
        let obj;
        if (count === 0) {
          classes.updateClassOrder(dragClass.id, dragObject.oldIndex, dragObject.newIndex);
        } else if (dir === 'up') {
          obj = listClasses[dragObject.oldIndex - count];
          classes.updateClassOrder(obj.id, obj.order, obj.order + 1);
        } else {
          obj = listClasses[dragObject.oldIndex + count];
          classes.updateClassOrder(obj.id, obj.order, obj.order - 1);
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
    const { classes, selected, onSelect, type, sortable } = this.props;
    let selectedItems = (selected) ? selected : [];
    let retVal = (
      <List>
      {classes.getClasses().map((item, index) =>
        <Class
          key={item.id}
          index={index}
          item={item}
          type={type}
          onSelect={onSelect}
          selected={selectedItems.indexOf(item.id)} 
        />
      )}
      </List>
    );
    if (sortable) {
      retVal = (<SortableComponent items={classes.getClasses()} onSortEnd={this.moveClass} />);
    }

    return retVal;
  }
}
export default ListClasses;
