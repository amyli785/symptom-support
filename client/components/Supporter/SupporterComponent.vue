<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article
      class="support-container"
    >
      <header>
        <h2>
            <div class="support-display-name"><strong>{{supporter.supporterDisplay}}</strong></div> <div class="support-username"> @{{ supporter.supporter }}</div>
        </h2>
        <!-- <h3 class="author">
            {{ supporter.supporter.displayName }}
          @{{ supporter.supporter }}
        </h3> -->
        <!-- <select
            v-if="editing"
            class="permission"
            :value="draft"
            @input="draft = $event.target.value"
        >
            <option
                v-for="level in ['','viewer','creator','manager']"
            >{{level}}</option>
        </select>
        <p
            v-else
            class="permission"
        >
          This supporter is a <strong>{{ supporter.permission }}</strong>.
        </p> -->
        <div
            class="permission-container"
        >
            <p>This supporter is a </p>
            <select
                v-if="editing"
                class="permission"
                :value="draft"
                @input="draft = $event.target.value"
            >
                <option
                    v-for="level in ['','viewer','creator','manager']"
                >{{level}}</option>
            </select>
            <p
                v-else
                class="permission"
            >
                <strong>{{ supporter.permission }}</strong>.
            </p>
        </div>
        <p>
            Invite status: <strong>{{supporter.inviteStatus}}</strong>.
        </p>
        <div
            class="actions-container"
        >
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
            <DeleteButton @click="removeSupporter" />
        </div>

      </header>
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
import CancelButton from '../common/CancelButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';
  
export default {
    name: 'SupporterComponent',
    components: {
        AcceptButton,
        CancelButton,
        EditButton,
        DeleteButton,
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
        editing: false, // Whether or not this freet is in edit mode
        draft: this.supporter.permission, // Potentially-new content for this freet
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    methods: {
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
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draft = this.supporter.permission; // The permission of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draft = this.supporter.permission;
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            this.editing = false;
            if (this.supporter.permission === this.draft) {
                const error = 'Error: Edited permission level should be different than current permission level.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: 'PATCH',
                message: 'Successfully edited permission!',
                body: JSON.stringify({permission: this.draft}),
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
                const r = await fetch(`/api/supports/supporter/${this.supporter.supporter}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.$store.commit('refreshSupporter');
                this.$store.commit('refreshSupporterRequest');
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

h2 {
    display: flex;
    flex-direction:row;
    gap: 10px;
    align-items: flex-end;
}

.support-username{
    font-size:75%;
}
.supporter {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.actions-container {
    display:flex;
    justify-content:flex-start;
    gap: 12px;
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

.permission-container {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: flex-start;
}

</style>