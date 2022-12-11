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
      <section class = 'all-trends' v-if="$store.state.username">
        <TrendComponent 
            :title="'Last 7 Days'"
            :trendItems="weeklyTrends"
        />
        <TrendComponent 
            :title="'Last 30 Days'"
            :trendItems="monthlyTrends"
        />
        <TrendComponent 
            :title="'All Time'"
            :trendItems="allTimeTrends"
        />
    </section>
        <article
          v-else
        >
          <h3>No trends found.</h3>
        </article>
    </main>
  </template>
  
  <script>
  import TrendComponent from './TrendComponent.vue';
  
  export default {
    name: 'TrendPage',
    components: {
        TrendComponent
    },
    data(){
        return {
            allTimeTrends: [],
            weeklyTrends: [],
            monthlyTrends: [],
            trendItems: {}
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
  
        // this.trendItems = res;
        this.allTimeTrends = res['allTimeTrends'];
        this.weeklyTrends = res['weeklyTrends'];
        this.monthlyTrends = res['monthlyTrends'];
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

.all-trends{
    display: flex;
    flex-direction: row;
    gap: 12px;
}
</style>