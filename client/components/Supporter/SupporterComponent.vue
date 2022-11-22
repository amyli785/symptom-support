<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article
      class="supporter"
    >
      <header>
        <h3 class="author">
            <!-- {{ supporter.supporter.displayName }} -->
          @{{ supporter.supporter }}
        </h3>
        <div
          v-if="$store.state.username"
          class="actions"
        >
          <button @click="removeSupporter">
            ❌ Remove supporter
          </button>
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
  
  export default {
    name: 'SupporterComponent',
    props: {
      // Data from the stored supporter
      supporter: {
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
.supporter {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>