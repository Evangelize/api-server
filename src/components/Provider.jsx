import { Component, PropTypes, Children } from 'react';
import { contextTypes } from 'mobx-connect';

export default class Provider extends Component {
  static childContextTypes = contextTypes;

  getChildContext() {
    //console.log(this.props.context);
    return this.props.context;
  }
  render() {
    return this.props.children;
  }
}