import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

@observer
class Class extends Component {
  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { item, selected, type, onSelect } = this.props;
    let Item = (
      <ListItem
        onClick={((...args) => this.navigate(`/classes/${item.id}`, ...args))}
        primaryText={item.title}
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
export default Class;
