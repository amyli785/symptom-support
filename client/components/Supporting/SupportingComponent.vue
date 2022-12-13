<template>
  <article :class="`support-container ${supporting.inviteStatus}`" @click="goToSupportingEntryFeed">
    <section class="support-display-container">
      <h2 class="support-header">
        <div class="support-display-name"><strong>{{supporting.supportingDisplay}}</strong></div>
        &nbsp;
        <div class="support-username"> @{{ supporting.supporting }}</div>
      </h2>
      <div>You are a <strong>{{supporting.permission}}</strong>.</div>
      <div class="actions-container">
        <AcceptButton
          v-if="supporting.inviteStatus === 'invited'"
          @click="acceptInvite"
        />
        <XButton v-if="supporting.inviteStatus === 'invited'" @click="removeSupporting"/>
        <DeleteButton v-if="supporting.inviteStatus === 'accepted'" @click="removeSupportingClick"/>
      </div>
    </section>
    <ConfirmDeleteModal class="modal"
    itemType = "supporting"
    itemName = "your supporting"
    :itemId = "supporting._id"
    :deleteFunction = "this.removeSupporting"
    />
  </article>
</template>

<script>

import AcceptButton from '../common/AcceptButton';
import DeleteButton from '../common/DeleteButton';
import XButton from '../common/XButton';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
  
export default {
  name: 'SupportingComponent',
  components: {
    AcceptButton,
    DeleteButton,
    XButton,
    ConfirmDeleteModal
  },
  props: {
    // Data from the stored supporting
    supporting: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToSupportingEntryFeed(){
      if (this.supporting.inviteStatus == 'accepted'){
        this.$router.push({ path: '/entries', query: { username: this.supporting.supporting } })
      }
    },
    removeSupportingClick(){
      /**
       * Shows modal to confirm removing a supporting. 
       */
      event.stopPropagation();
      this.$bvModal.show(`confirm-delete-modal-supporting-${this.supporting._id}`);
    },
    removeSupporting() {
      /**
       * Deletes this supporting.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed supporting!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    acceptInvite(){
      const params = {
          method: 'PATCH',
          body: JSON.stringify({inviteStatus: 'accepted'}),
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully accepted invite!', status: 'success'
            });
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
        const r = await fetch(`/api/supports/supporting/${this.supporting.supporting}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshSupporting');
        this.$store.commit('refreshSupportingRequest');
        params.callback();
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
.support-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(33.3333% - 8px);
}

.support-display-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  gap: 10px;

}

.accepted:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 4px var(--dark-blue-drop-shadow));
}

.support-header {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.support-username{
  font-size: 75%;
}

.permission-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.actions-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;
  font-size: x-large;
}
</style>