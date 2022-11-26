import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    username: null, // Username of the logged in user
    displayName: null, //Display name of logged in user
    supported: [],
    supporter: [],
    entries: [],
    supportedRequests: [],
    supporterRequests: [],
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setDisplayName(state, displayName){
      /**
       * Update the stored display name to the specified one.
       * @param displayName - new display name to set
       */
       state.displayName = displayName;
    },
    updateSupported(state, supported) {
      /**
       * Update the stored supported to the provided supported.
       * @param supported - Supported to store
       */
      state.supported = supported;
    },
    async refreshSupported(state) {
      /**
       * Request the server for the currently available supported.
       */
      const url = `/api/supports/supported?inviteStatus=accepted`;
      const res = await fetch(url).then(async r => r.json());
      state.supported = res;
    },
    updateSupporter(state, supporter) {
      /**
       * Update the stored supporters to the provided supporters.
       * @param supporter - Supporters to store
       */
      state.supporter = supporter;
    },
    async refreshSupporter(state) {
      /**
       * Request the server for the currently available supporters.
       */
      const url = `/api/supports/supporter?inviteStatus=accepted`;
      const res = await fetch(url).then(async r => r.json());
      state.supporter = res;
    },
    updateSupportedRequest(state, supportedRequests) {
      /**
       * Update the stored supporters to the provided supporters.
       * @param supporter - Supporters to store
       */
      state.supportedRequests = supportedRequests;
    },
    async refreshSupportedRequest(state) {
      /**
       * Request the server for the currently available supporters.
       */
      const url = `/api/supports/supported?inviteStatus=invited`;
      const res = await fetch(url).then(async r => r.json());
      state.supportedRequests = res;
    },
    updateSupporterRequest(state, supporterRequests) {
      /**
       * Update the stored supporters to the provided supporters.
       * @param supporter - Supporters to store
       */
      state.supporterRequests = supporterRequests;
    },
    async refreshSupporterRequest(state) {
      /**
       * Request the server for the currently available supporters.
       */
      const url = `/api/supports/supporter?inviteStatus=invited`;
      const res = await fetch(url).then(async r => r.json());
      state.supporterRequests = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
