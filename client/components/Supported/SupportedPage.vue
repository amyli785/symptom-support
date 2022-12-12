<template>
  <main>
    <section v-if="$store.state.username" class="support-page-container">
      <header class="support-page-header">
        <h2>Supporting</h2>
        <HomeButton />
      </header>
      <article class="support-page-content">
        <section
          v-if="$store.state.supportedRequests.length"
          class="support-section-container"
        >
          <h3>Requests</h3>
          <article class="support-section-content">
            <SupportedComponent
              v-for="supported in $store.state.supportedRequests"
              :key="supported.id"
              :supported="supported"
            />
          </article>
        </section>
        <section
          v-if="$store.state.supported.length"
          class="support-section-container"
        >
          <h3>Accepted</h3>
          <article class="support-section-content">
            <SupportedComponent
              v-for="supported in $store.state.supported"
              :key="supported.id"
              :supported="supported"
            />
          </article>
        </section>
        <article v-else>
          <h3> supported found.</h3>
        </article>
      </article>
    </section>
    <section v-else class="support-page-container">
      <header class="support-page-header">
        <h2>Welcome to Symptom Support!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to view supporting.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';
import SupportedComponent from '@/components/Supported/SupportedComponent.vue';

export default {
  name: 'SupportedPage',
  components: {
    HomeButton,
    SupportedComponent,
  },
  async mounted() {
    let url = `/api/supports/supported?inviteStatus=accepted`;
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

    url = `/api/supports/supported?inviteStatus=invited`;
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

<style scoped>
.support-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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