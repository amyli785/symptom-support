<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Supporters</h2>
        </header>
        <CreateSupportForm />
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
            to view supporters.
          </h3>
        </article>
      </section>
      <section v-if="$store.state.username">
        <header>
          <div class="left">
          </div>
        </header>
        <section
          v-if="$store.state.supporter.length"
        >
          <SupporterComponent
            v-for="supporter in $store.state.supporter"
            :key="supporter.id"
            :supporter="supporter"
          />
        </section>
        <article
          v-else
        >
          <h3>No supporters found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import SupporterComponent from '@/components/Supporter/SupporterComponent.vue';
  import CreateSupportForm from '@/components/Supporter/CreateSupportForm.vue';
  
  export default {
    name: 'SupporterPage',
    components: {SupporterComponent, CreateSupportForm},
    async mounted() {
      const url = `/api/supports/supporter`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
  
        this.$store.commit('updateSupporter', res);
      } catch (e) {
  
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  };
  </script>