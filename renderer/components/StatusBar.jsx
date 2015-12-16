import React from 'react';
import StateStore from '../stores/StatusStore';

function getStateFromStores() {
  return {
    memuse: StateStore.getMemUse()
  };
}

const StatusBar = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    StateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    StateStore.removeChangeListener(this._onChange);
  },

  render() {
    return (
      <div className="status-bar">
        <span>Proxy Port: 61234</span>
        <span className="pull-right">MEM: {this.state.memuse}</span>
      </div>
    );
  },

  _onChange() {
    this.setState(getStateFromStores());
  }
});

export default StatusBar;
