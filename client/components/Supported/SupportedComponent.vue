<!-- Reusable component representing a single supported and its actions -->

<template>
    <article
      class="supported"
    >
      <header>
        <h2>
          {{ supported.supportedDisplay }}
        </h2>
        <h3 class="author">
          @{{ supported.supported }}
        </h3>
        <p>
            {{supported.permission}}
        </p>
        <div
          v-if="$store.state.username"
          class="actions"
        >
          <button @click="removeSupported">
            ❌ Stop supporting
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
    name: 'SupportedComponent',
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
</style>