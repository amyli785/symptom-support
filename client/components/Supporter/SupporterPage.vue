<template>
  <main>
    <section v-if="$store.state.username" class="support-page-container">
      <header>
        <h2>Supporters</h2>
        <h2><HomeButton /></h2>
      </header>
      <article class="support-page-content">
        <CreateSupportForm />
        <section
          v-if="$store.state.supporterRequests.length"
          class="support-section-container"
        >
          <h3>Requests</h3>
          <article class="support-section-content">
            <SupporterComponent
              v-for="supporter in $store.state.supporterRequests"
              :key="supporter.id"
              :supporter="supporter"
            />
          </article>
        </section>
        <section
          v-if="$store.state.supporter.length"
          class="support-section-container"
        >
          <h3>Accepted</h3>
          <article class="support-section-content">
            <SupporterComponent
              v-for="supporter in $store.state.supporter"
              :key="supporter.id"
              :supporter="supporter"
            />
          </article>
        </section>
        <article v-else>
          <h3>No accepted supporters found.</h3>
        </article>
      </article>
    </section>
    <section v-else class="support-page-container">
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
  </main>
</template>
  
<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';
import SupporterComponent from '@/components/Supporter/SupporterComponent.vue';
import CreateSupportForm from '@/components/Supporter/CreateSupportForm.vue';

export default {
  name: 'SupporterPage',
  components: {HomeButton, SupporterComponent, CreateSupportForm},
  methods:{
    toSupporterPage() {
      this.$router.push({name: 'Supporter Request'})
    }
  },
  async mounted() {
    let url = `/api/supports/supporter?inviteStatus=accepted`;
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

    url = `/api/supports/supporter?inviteStatus=invited`;
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
.support-page-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  gap: 40px;
}

.support-section-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.support-section-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;

  gap: 12px;
}

</style>