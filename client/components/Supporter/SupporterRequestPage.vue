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
            to view supporter requests.
          </h3>
        </article>
      </section>
      <section v-if="$store.state.username">
        <header>
          <div class="left">
            <h2>
              Supporter Requests
            </h2>
          </div>
        </header>
        <section
          v-if="$store.state.supporterRequests.length"
        >
          <SupporterComponent
            v-for="supporter in $store.state.supporterRequests"
            :key="supporter.id"
            :supporter="supporter"
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
  import SupporterComponent from '@/components/Supporter/SupporterComponent.vue';
  
  export default {
    name: 'SupporterRequestPage',
    components: {SupporterComponent},
    async mounted() {
      const url = `/api/supports/supporter?inviteStatus=invited`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateSupporterRequest', res);
      } catch (e) {
  
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  };
  </script>
<style scoped>
h2 {
  margin: 0;
}
header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>