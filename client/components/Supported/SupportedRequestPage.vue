<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
      </section>
      <section v-else>
        <header>
          <h2>Welcome to Symptom Support!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
            to view supported requests.
          </h3>
        </article>
      </section>
      <section v-if="$store.state.username">
        <header>
          <div class="left">
            <h2>
              Supported Requests
            </h2>
          </div>
        </header>
        <section
          v-if="$store.state.supportedRequests.length"
        >
          <SupportedComponent
            v-for="supported in $store.state.supportedRequests"
            :key="supported.id"
            :supported="supported"
          />
        </section>
        <article
          v-else
        >
          <h3>No requests found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import SupportedComponent from '@/components/Supported/SupportedComponent.vue';
  
  export default {
    name: 'SupportedRequestPage',
    components: {SupportedComponent},
    async mounted() {
      const url = `/api/supports/supported?inviteStatus=invited`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateSupportedRequest', res);
      } catch (e) {
  
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  };
  </script>