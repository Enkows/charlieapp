import ipc from 'ipc';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/StatusConstants';

class IpcService {
  init() {
    console.log('ipc service start.');

    ipc.on('memuse', (memuse) => {
      // console.log('MEMUSE', memuse);
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_MEMORY_USAGE,
        memuse: memuse
      });
    });

    ipc.on('request', (request) => {
      // console.log('REQUEST', request);
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_REQUEST,
        request: request
      });
    });
  }
}

export default new IpcService();
