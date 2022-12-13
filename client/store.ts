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
    supporting: [],
    supporter: [],
    entries: [],
    flagged: [],
    supportingRequests: [],
    supporterRequests: [],
    entryStatus: null,
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
      if (!username){
        localStorage.removeItem('username');
      }
      else{
        localStorage.setItem('username',username);
      }
    },
    setDisplayName(state, displayName){
      /**
       * Update the stored display name to the specified one.
       * @param displayName - new display name to set
       */
       state.displayName = displayName;
    },
    async refreshEntries(state){
      /**
       * Request the server for the logged in user's entries
       */
      const url = `/api/entries?username=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.entries = res;
    },
    updateEntryFlag(state, entry){
      const entryMatches = state.entries.filter(entryExisting => entryExisting._id === entry._id);

      if (entryMatches.length > 1) {
        console.log(`Number of matches found for entry > 1: ${entryMatches}`);
        return;
      }
      if (entryMatches.length === 0) {
        console.log(`Number of matches found for entry = 0`);
        return;
      }

      const entryMatch = entryMatches[0];
      entryMatch.flag = entry.flag;
    },
    clearEntries(state){
      state.entries = [];
    },
    goToEntry(state, entryStatus){
      state.entryStatus = entryStatus;
    },
    cleanEntryStatus(state){
      state.entryStatus = null;
    },
    updateSupporting(state, supporting) {
      /**
       * Update the stored supporting to the provided supporting.
       * @param supporting - Supporting to store
       */
      state.supporting = supporting;
    },
    async refreshSupporting(state) {
      /**
       * Request the server for the currently available supporting.
       */
      const url = `/api/supports/supporting?inviteStatus=accepted`;
      const res = await fetch(url).then(async r => r.json());
      state.supporting = res;
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
    updateSupportingRequest(state, supportingRequests) {
      /**
       * Update the stored supporters to the provided supporters.
       * @param supporter - Supporters to store
       */
      state.supportingRequests = supportingRequests;
    },
    async refreshSupportingRequest(state) {
      /**
       * Request the server for the currently available supporters.
       */
      const url = `/api/supports/supporting?inviteStatus=invited`;
      const res = await fetch(url).then(async r => r.json());
      state.supportingRequests = res;
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
