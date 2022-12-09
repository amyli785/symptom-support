<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>
            Supporting
          </h2>
          <h2><font-awesome-icon @click ="goHome" class = "icon" icon="fa-solid fa-house" /></h2>
        </header>
        <section
          v-if="$store.state.supportedRequests.length"
          class="support-invited"
        >
          <SupportedComponent
            v-for="supported in $store.state.supportedRequests"
            :key="supported.id"
            :supported="supported"
          />
        </section>
        <section
          v-if="$store.state.supported.length"
          class="support-accepted"
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
          <h3>No accepted supported found.</h3>
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
      goHome(){
            this.$router.push({name: 'Home'});
      },
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

h2 {
  margin: 0;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.icon{
  font-size: 40px;
}
.icon:hover {
  transform: scale(1.1, 1.1);
  cursor: pointer;
}
</style>