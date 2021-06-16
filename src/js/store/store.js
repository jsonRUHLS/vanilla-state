import PubSub from '../lib/pubsub.js';

export default class Store {
  constructor(params) {
    actions = {};
    mutations = {};
    state = {};
    status = 'default state';
    events = new PubSub();
    if (params.hasOwnProperty('actions')) {
      this.actions = params.actions;
    }
    if (params.hasOwnProperty('mutations')) {
      this.mutations = params.mutations;
    }
    this.state = new Proxy((params.state || {}), {
      set: (state, key, value) => {
        state[key] = value;
        console.log(`stateChange: ${key}: ${value}`);
        this.events.publish('stateChange', state);
        if (this.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }
        this.status = 'resting';
        return true;
      }
    });
  }
  dispatch(actionKey, payload) {
    let self = this;
    if (typeof actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }
    console.groupCollapsed(`ACTION: ${actionKey}`);
    this.status = 'action';
    this.actions[actionKey](self, payload);
    console.groupEnd();
    return true;
  }
  commit(mutationKey, payload) {
    if (typeof this.mutations[mutationKey] !== 'function') {
      console.log(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }
    this.status = 'mutation';
    let newState = this.mutations[mutationKey](this.state, payload);
    this.state = Object.assign(this.state, newState);
    return true;
  }
}