import React from 'react';
import AppStore from '../stores/AppStore';
import AppAction from '../actions/AppAction';

function _getStateFromStores() {
  return {
    requests: AppStore.getCurrentRequests(),
    currentRequestIndex: AppStore.getCurrentRequestIndex()
  };
}

const Path = React.createClass({
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
    const pathNodes = this.state.requests.map((request, index) => {
      const className = this.state.currentRequestIndex === index ? 'active' : '';
      return (
        <tr className={className} onClick={() => this._onClick(index)}>
          <td>{request.resp.statusCode}</td>
          <td>{request.req.method}</td>
          <td nowrap>{request.req.url}</td>
        </tr>
      );
    });

    return (
      <div className="paths">
        <table className="table table-condensed table-bordered">
          <thead>
            <th width="30">STATUS</th>
            <th width="40">METHOD</th>
            <th>NAME</th>
          </thead>
          <tbody>{pathNodes}</tbody>
        </table>
      </div>
    );
  },

  _onChange() {
    this.setState(_getStateFromStores());
  },

  _onClick(index) {
    AppAction.clickRequest(index);
  }

});

export default Path;
