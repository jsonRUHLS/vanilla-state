import actions from './actions.js';
import mutations from './mutations';
import state from './state';
import Store from './store';

export default new Store({
  actions,
  mutations,
  state
});