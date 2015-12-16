import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/StatusConstants';

let stateStore;
let _memuse = '0 MB';

class StateStore extends BaseStore {
  constructor() {
    super();
  }

  getMemUse() {
    return _memuse;
  }
}

stateStore = new StateStore();

StateStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {

    case ActionTypes.RECEIVE_MEMORY_USAGE:
      _memuse = action.memuse;
      stateStore.emitChange();
      break;

    default:
      // do nothing
  }
});

export default stateStore;
