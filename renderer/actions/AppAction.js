import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/StatusConstants';

export default {
  clickHost(host) {
    AppDispatcher.dispatch({
      type: ActionTypes.CLICK_HOST,
      host: host
    });
  },

  clickRequest(index) {
    AppDispatcher.dispatch({
      type: ActionTypes.CLICK_REQUEST,
      index: index
    });
  }
};
