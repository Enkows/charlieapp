import url from 'url';
import qs from 'querystring';
import React from 'react';
import AppStore from '../stores/AppStore';
import AppAction from '../actions/AppAction';

function _getStateFromStores() {
  return {
    request: AppStore.getCurrentRequest()
  };
}

function _getQueryStr(uri) {
  const query = qs.parse(url.parse(uri).query);
  return JSON.stringify(query, null, 4);
}

const Result = React.createClass({
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
    if (!this.state.request) {
      return this.renderDefaultView();
    } else {
      return (
        <div className="result">
          <ul className="nav nav-tabs">
            <li className="active"><a href="#Headers" data-toggle="tab">Headers</a></li>
            <li><a href="#Params" data-toggle="tab">Params</a></li>
            <li><a href="#Response" data-toggle="tab">Response</a></li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active" id="Headers">
              <p>Request Headers:</p>
              <pre>{JSON.stringify(this.state.request.req.headers, null, 4)}</pre>
              <p>Response Headers:</p>
              <pre>{JSON.stringify(this.state.request.resp.headers, null, 4)}</pre>
            </div>
            <div className="tab-pane" id="Params">
              <pre>{_getQueryStr(this.state.request.req.url)}</pre>
            </div>
            <div className="tab-pane" id="Response">
              <pre>{this.state.request.body}</pre>
            </div>
          </div>
        </div>
      );
    }
  },

  renderDefaultView() {
    return (
      <div></div>
    );
  },

  _onChange() {
    this.setState(_getStateFromStores());
  },

  _onClick(index) {
    AppAction.clickRequest(index);
  }

});

export default Result;
