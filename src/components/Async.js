import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class Async extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
    };
  }

  componentWillMount() {
    if (this.props.promise) {
      this.handlePromise(this.props.promise);
    }
  }

  componentWillReceiveProps(nP) {
    if (nP.promise !== this.props.promise) {
      this.state = {};
      this.forceUpdate();
      this.handlePromise(nP.promise);
    }
  }

  handlePromise() {
    const { promise } = this.props;
    const self = this;
    this.setState({
      started: true,
    });
    promise.then(
      (res) => {
        self.setState({
          resolved: res,
          finished: true,
        });
      }
    ).catch(
      (err) => {
        self.setState({
          rejected: err,
          finished: true,
        });
      }
    );
  }

  render() {
    const { props, state } = this;
    let retVal = (<div></div>);
    if (state.started) {
      if (!state.finished) {
        if (props.pendingRender) {
          retVal = props.pendingRender;  // custom component to indicate load in progress
        }
      }
      if (props.then && state.resolved) {
        retVal = props.then(state.resolved);
      }
      if (props.catch && state.rejected) {
        retVal = props.catch(state.rejected);
      }
    } else {
      retVal = this.props.before(() => this.handlePromise());
    }
    return retVal;
  }
}

Async.propTypes = {
  before: PropTypes.func, // renders it's return value before promise is handled
  then: PropTypes.func, // renders it's return value when promise is resolved
  catch: PropTypes.func, // renders it's return value when promise is rejected
  pendingRender: PropTypes.node, // renders it's value when promise is pending
  promise: PropTypes.object, // promise itself
};

export default Async;
