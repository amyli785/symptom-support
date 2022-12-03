<!-- Reusable component representing a single supported and its actions -->

<template>
    <article :class="`support-container ${supported.inviteStatus}`" @click="goToSupportedEntryFeed"
    >
      <header>
        <h2>
            <div class="support-display-name"><strong>{{supported.supportedDisplay}}</strong></div> <div class="support-username"> @{{ supported.supported }}</div>
        </h2>
        <p>
            You are a <strong>{{supported.permission}}</strong>.
        </p>
        <p>
            Invite status: <strong>{{supported.inviteStatus}}</strong>.
        </p>
      </header>
      <div
          v-if="$store.state.username"
          class="actions-container"
        >
          <AcceptButton
            v-if="supported.inviteStatus === 'invited'"
            @click="acceptInvite"
          />
          <DeleteButton @click="removeSupported"/>
        </div>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </article>
  </template>
  
  <script>

import AcceptButton from '../common/AcceptButton';
import DeleteButton from '../common/DeleteButton';
  
export default {
  name: 'SupportedComponent',
  components: {
    AcceptButton,
    DeleteButton
  },
  props: {
    // Data from the stored supported
    supported: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    goToSupportedEntryFeed(){
      if (this.supported.inviteStatus == 'accepted'){
        this.$router.push({ path: '/entries', query: { username: this.supported.supported } })
      }
    },
    removeSupported() {
      /**
       * Deletes this supported.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed supported!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    acceptInvite(){
      const params = {
          method: 'PATCH',
          message: 'Successfully accepted invite!',
          body: JSON.stringify({inviteStatus: 'accepted'}),
          callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the support endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/supports/supported/${this.supported.supported}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshSupported');
        this.$store.commit('refreshSupportedRequest');
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.supported {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.actions-container {
    display:flex;
    justify-content:flex-start;
    align-items:center;
    gap: 12px;
}

.support-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(50% - 20px);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:flex-start;

  gap: 12px;
}
.accepted:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 4px var(--dark-blue-drop-shadow));
}

h2 {
    display: flex;
    flex-direction:row;
    gap: 10px;
    align-items: flex-end;
}

.support-username{
    font-size:75%;
}
.support-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(31%);

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  gap: 12px;
}
/* .selected {
  background-color: var(--salmon);
}
.left-content {
  flex: 0 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  gap: 4px;
}

.right-icons {
  flex: 1 0 0%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.icons-top {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 12px;
}

.icons-bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 12px;
}

.entry-dates-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding: 0 8px;

  font-weight: bold;
  font-size: medium;
} */

</style>