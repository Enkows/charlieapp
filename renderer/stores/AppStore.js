import mapKeys from 'lodash/object/mapKeys';
import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/StatusConstants';


const _requestMap = {};
let appStore;
let _currentHost;
let _currentRequestIndex = 0;

class AppStore extends BaseStore {
  getCurrentHostName() {
    return _currentHost;
  }

  getCurrentRequestIndex() {
    return _currentRequestIndex;
  }

  getCurrentRequest() {
    const requests = _requestMap[_currentHost] || [];
    return requests[_currentRequestIndex];
  }

  getCurrentRequests() {
    return _requestMap[_currentHost] || [];
  }

  getAllHostName() {
    const hosts = [];
    mapKeys(_requestMap, (requests, name) => {
      hosts.push({
        name: name,
        count: requests.length
      });
    });
    return hosts;
  }
}

appStore = new AppStore();
AppStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {

    case ActionTypes.RECEIVE_REQUEST:
      _addRequestToMap(action.request);
      appStore.emitChange();
      break;

    case ActionTypes.CLICK_HOST:
      _currentHost = action.host;
      appStore.emitChange();
      break;

    case ActionTypes.CLICK_REQUEST:
      _currentRequestIndex = action.index;
      appStore.emitChange();
      break;

    default:
      // do nothing
  }
});

/**
 * Add request to map
 *
 * @param {Object} request
 * @returns
 */
function _addRequestToMap(request) {
  const hostName = request.req.headers.host;
  if (_requestMap[hostName] === undefined) {
    _requestMap[hostName] = [];
  }
  _requestMap[hostName].push(request);
}

export default appStore;
