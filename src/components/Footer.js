import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class Footer extends Component {
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return name;
    }

    return (
      <a href="#" onClick={e => {
        e.preventDefault();
        this.props.onFilterChange(filter);
      }}>
        {name}
      </a>
    );
  }

  renderFilters() {
    return (
      <div>
        Show:
        {' '}
        {this.renderFilter('SHOW_ALL', 'All')}
        {', '}
        {this.renderFilter('SHOW_COMPLETED', 'Completed')}
        {', '}
        {this.renderFilter('SHOW_ACTIVE', 'Active')}
        .
      </div>
    );
  }

  renderUndo() {
    return (
      <div>
        <RaisedButton onClick={this.props.onUndo} disabled={this.props.undoDisabled} label="Undo" /> &nbsp;
        <RaisedButton onClick={this.props.onRedo} disabled={this.props.redoDisabled} label="Redo" />
      </div>
   );
  }

  render() {
    return (
      <div>
        {this.renderFilters()}
        {this.renderUndo()}
      </div>
    );
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired,
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};
