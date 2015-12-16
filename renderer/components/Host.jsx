import React from 'react';
import AppStore from '../stores/AppStore';
import AppAction from '../actions/AppAction';

function _getStateFromStores() {
  return {
    hosts: AppStore.getAllHostName(),
    currentHost: AppStore.getCurrentHostName()
  };
}

const Host = React.createClass({
  getInitialState() {
    return _getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  },

  render() {
    const hostNodes = this.state.hosts.map((host) => {
      const className = this.state.currentHost === host.name ? 'list-group-item active' : 'list-group-item';
      return (
        <li className={className} onClick={() => this._onSelectHost(host.name)}>
          <span className="badge">{host.count}</span>
          {host.name}
        </li>
      );
    });

    return (
      <div className="hosts">
        <ul className="list-group">
          {hostNodes}
        </ul>
      </div>
    );
  },

  _onChange() {
    this.setState(_getStateFromStores());
  },

  _onSelectHost(host) {
    AppAction.clickHost(host);
  }
});

export default Host;
