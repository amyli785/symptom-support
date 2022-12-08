<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Trends</h2>
          <h2><font-awesome-icon @click ="goHome" class = "icon" icon="fa-solid fa-house" /></h2>
        </header>
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
            to view your trends.
          </h3>
        </article>
      </section>
      <section v-if="$store.state.username">
        <section
          v-if="trendItems.length"
        >
            <p class="trend-item" v-for="trend in trendItems"> {{trend.display}}: {{trend.value}}</p>
        </section>
        <article
          v-else
        >
          <h3>No trends found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  
  export default {
    name: 'TrendPage',
    data(){
        return {
            trendItems: [],
        }
    },
    methods:{
      goHome(){
            this.$router.push({name: 'Home'});
      },
    },
    async mounted() {
      let url = `/api/trends`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
  
        this.trendItems = res;
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