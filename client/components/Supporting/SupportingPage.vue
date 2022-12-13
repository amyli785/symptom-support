<template>
  <main>
    <section v-if="$store.state.username" class="support-page-container">
      <header>
        <h2>Supporting</h2>
        <h2><HomeButton /></h2>
      </header>
      <article class="support-page-content">
        <section
          v-if="$store.state.supportingRequests.length"
          class="support-section-container"
        >
          <h3>Requests</h3>
          <article class="support-section-content">
            <SupportingComponent
              v-for="supporting in $store.state.supportingRequests"
              :key="supporting.id"
              :supporting="supporting"
            />
          </article>
        </section>
        <section
          v-if="$store.state.supporting.length"
          class="support-section-container"
        >
          <h3>Accepted</h3>
          <article class="support-section-content">
            <SupportingComponent
              v-for="supporting in $store.state.supporting"
              :key="supporting.id"
              :supporting="supporting"
            />
          </article>
        </section>
        <section v-else>
          <h3> You are not supporting anyone.</h3>
        </section>
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
          to view supporting.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';
import SupportingComponent from '@/components/Supporting/SupportingComponent.vue';

export default {
  name: 'SupportingPage',
  components: {
    HomeButton,
    SupportingComponent,
  },
  async mounted() {
    let url = `/api/supports/supporting?inviteStatus=accepted`;
    try {
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.$store.commit('updateSupporting', res);
    } catch (e) {
      this.$store.commit('alert', {
        message: e, status: 'error'
      });
    }

    url = `/api/supports/supporting?inviteStatus=invited`;
    try {
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.$store.commit('updateSupportingRequest', res);
    } catch (e) {
      this.$store.commit('alert', {
        message: e, status: 'error'
      });
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

  gap: 10px;
}

</style>