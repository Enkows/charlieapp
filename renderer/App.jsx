import React from 'react';
import IpcService from './utils/IpcService';

import StatusBar from './components/StatusBar';
import Host from './components/Host';
import Path from './components/Path';
import Result from './components/Result';

class Charlie extends React.Component {
  componentDidMount() {
    IpcService.init();
  }

  render() {
    return (
      <div className="wrapper">
        <div className="side">
          <Host />
        </div>
        <div className="content">
          <Path />
          <Result />
        </div>
        <StatusBar />
      </div>
    );
  }
}

React.render(
  <Charlie />, document.body
);
