import { Component, PropTypes, Children } from 'react';

export default class Provider extends Component {
  getChildContext() {
    return { store: this.store };
  }

  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }

  render() {
    let { children } = this.props;
    return Children.only(children);
  }
}

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    const { store } = this;
    const { store: nextStore } = nextProps;
  }
}

Provider.propTypes = {
  store: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
  store: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired
}
