<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Supporters</h2>
        </header>
        <CreateSupportForm />
        <!-- <button
          v-if="$store.state.username"
          @click="toSupporterPage"
        >
          View supporter requests
        </button> -->
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
          v-if="$store.state.supporterRequests.length"
          class="support-invited"
        >
          <SupporterComponent
            v-for="supporter in $store.state.supporterRequests"
            :key="supporter.id"
            :supporter="supporter"
          />
        </section>
        <section
          v-if="$store.state.supporter.length"
          class="support-accepted"
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
          <h3>No accepted supporters found.</h3>
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
section {
  display: flex;
  flex-direction: column;
}
.support-invited {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: space-around; */
  /* justify-content:space-evenly; */

  gap: 40px;
}

.support-accepted {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: space-between; */

  gap: 40px;
}
</style>