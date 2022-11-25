<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <div class="left">
            <h2>
              Supported
            </h2>
            <button
              v-if="$store.state.username"
              @click="toSupportedPage"
            >
              View supported requests
            </button>
          </div>
        </header>
        <section
          v-if="$store.state.supported.length"
        >
          <SupportedComponent
            v-for="supported in $store.state.supported"
            :key="supported.id"
            :supported="supported"
          />
        </section>
        <article
          v-else
        >
          <h3>No supported found.</h3>
        </article>
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
            to view supported.
          </h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import SupportedComponent from '@/components/Supported/SupportedComponent.vue';
  
  export default {
    name: 'SupportedPage',
    components: {SupportedComponent},
    methods:{
      toSupportedPage() {
        this.$router.push({name: 'Supported Request'})
      }
    },
    async mounted() {
      const url = `/api/supports/supported?inviteStatus=accepted`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateSupported', res);
      } catch (e) {
  
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  };
  </script>