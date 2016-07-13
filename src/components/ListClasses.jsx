import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import {List, ListItem} from 'material-ui/List';
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
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Class from './Class';


const navigate = function(path, e) {
    browserHistory.push(path);
};
const iconButtonElement = (
  <IconButton
    touch={true}
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
const SortableItem = SortableElement(({item}) => {
  return (
    <div>
      <Divider />
      <ListItem
          primaryText={item.title}
      />
    </div>
  )
});
const SortableList = SortableContainer(({items}) => {
	return (
		<List>
			{items.map((item, index) =>
        <SortableItem key={`item-${item.id}`} index={index} item={item} />
      )}
		</List>
	);
});


class SortableComponent extends Component {
  render() {
    let {items, onSortEnd} = this.props;

    return (
      <SortableList items={items} onSortEnd={onSortEnd} />
    )
  }
}

@connect
class ListClasses extends Component {

  constructor(props, context) {
    super(props, context);
    //console.log("ListClasses:context", context);
    this.moveClass = this.moveClass.bind(this);
  }

 
  componentWillMount() {
    const { classes } = this.context.state;
    //console.log("ListClasses:willMount", context);
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      classes: []
    });
  }

  componentDidMount() {
    const { classes } = this.context.state;
    let self = this;
    classes.getClasses().then(
      function(data) {
        self.setState({
          classes: data
        })
      }
    )
  }
  
  moveClass(dragObject, e) {
    const { classes } = this.context.state;
    const listClasses = classes.getClasses();
    const { cards } = this.state;
    const dragClass = listClasses[dragObject.oldIndex];
    const hoverClass = listClasses[dragObject.newIndex];
    console.log("moveClass", dragClass, hoverClass);
    classes.updateClassOrder(dragClass.id, dragObject.oldIndex, dragObject.newIndex);
    classes.updateClassOrder(hoverClass.id, dragObject.newIndex, dragObject.oldIndex);
    //this.setState({
    //  listClasses: classes.getClasses()
    //});
  }

  render() {
    const { classes } = this.state;
    if (this.props.sortable) {
      return (
        <SortableComponent items={classes} onSortEnd={::this.moveClass}/>
      );
    } else {
      return (
        <List>
        {classes.map((item, index) =>
          <Class key={item.id} index={index} item={item} />
        )}
        </List>
      );
    }
  }
}
export default ListClasses;
