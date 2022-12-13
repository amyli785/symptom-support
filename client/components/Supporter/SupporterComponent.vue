<template>
  <article class="support-container">
    <section class="support-display-container">
      <h2 class="support-header">
        <div class="support-display-name"><strong>{{supporter.supporterDisplay}}</strong></div>
        &nbsp;
        <div class="support-username"> @{{ supporter.supporter }}</div>
      </h2>
      <div class="permission-container">
        <div>This supporter is a&nbsp;</div>
        <select
          v-if="editing"
          :value="draft"
          @input="draft = $event.target.value"
        >
          <option v-for="level in ['','viewer','creator','manager']">
            {{level}}
          </option>
        </select>
        <div v-else class="permission">
          <strong>{{ supporter.permission }}</strong>.
        </div>
      </div>
      <div class="actions-container">
        <AcceptButton
          v-if="editing"
          @click="submitEdit"
        />
        <CancelButton
          v-if="editing"
          @click="stopEditing"
        />
        <EditButton
          v-if="!editing"
          @click="startEditing"
        />
          <DeleteButton v-if="supporter.inviteStatus === 'invited'" @click="removeSupporter" />
          <DeleteButton v-if="supporter.inviteStatus === 'accepted'" @click="removeSupporterClick" />
      </div>
    </section>
    <ConfirmDeleteModal class="modal"
      itemName="your supporter"
      itemType="supporter"
      :itemId = "supporter._id"
      :deleteFunction = "this.removeSupporter"
    />
  </article>
</template>
  
<script>
import AcceptButton from '../common/AcceptButton';
import CancelButton from '../common/CancelButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
  
export default {
    name: 'SupporterComponent',
    components: {
        AcceptButton,
        CancelButton,
        EditButton,
        DeleteButton,
        ConfirmDeleteModal
    },
    props: {
      // Data from the stored supporter
      supporter: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editing: false,
        draft: this.supporter.permission,
      };
    },
    methods: {
      removeSupporterClick(){
        /** 
         * Shows modal to confirm removing a supporter. 
         */
        this.$bvModal.show(`confirm-delete-modal-supporter-${this.supporter._id}`);
      },
      removeSupporter() {
        /**
         * Removes this supporter
         */
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
            message: 'Successfully removed supporter!', status: 'success'
            });
          }
        };
        this.request(params);
      },
      startEditing() {
          /**
           * Enables edit mode on this component.
           */
          this.editing = true; // Keeps track of if a component is being edited
          this.draft = this.supporter.permission; // The permission of our current "draft" while being edited
      },
      stopEditing() {
        /**
         * Disables edit mode on this component.
         */
        this.editing = false;
        this.draft = this.supporter.permission;
      },
      submitEdit() {
        /**
         * Updates component to have the submitted draft content.
         */
        this.editing = false;
        if (this.supporter.permission === this.draft) {
            const error = 'Error: Edited permission level should be different than current permission level.';
            this.$store.commit('alert', {
              message: error, status: 'error'
            });
            return;
        }

        const params = {
            method: 'PATCH',
            body: JSON.stringify({permission: this.draft}),
            callback: () => {
              this.$store.commit('alert', {
                message: 'Successfully edited permission!', status: 'success'
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
            const r = await fetch(`/api/supports/supporter/${this.supporter.supporter}`, options);
            if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }

            this.$store.commit('refreshSupporter');
            this.$store.commit('refreshSupporterRequest');
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
  justify-content:flex-start;

  gap: 10px;
  font-size: x-large;
}

</style>