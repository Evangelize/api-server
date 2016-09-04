import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

@observer
class ClassGrouping extends Component {
  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { item } = this.props;

    return (
      <div>
        <Divider />
        <ListItem
          onClick={((...args) => this.navigate(`/schedule/${item.id}`, ...args))}
          primaryText={item.title}
        />
      </div>
    );
  }
}
export default ClassGrouping;
