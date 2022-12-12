<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Trends</h2>
          <h2><HomeButton /></h2>
        </header>
        <article class="all-trends">
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
            to view your trends.
          </h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import HomeButton from '@/components/common/HomeButtonWithAction.vue';
  import TrendComponent from './TrendComponent.vue';
  
  export default {
    name: 'TrendPage',
    components: {
      HomeButton, TrendComponent,
    },
    data(){
        return {
            allTimeTrends: [],
            weeklyTrends: [],
            monthlyTrends: [],
            // trendItems: {}
        }
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
        // this.trendItems = res;
        // for (const obj of res){
        //   console.log(obj);
        // }
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

.all-trends{
    display: flex;
    flex-direction: row;
    gap: 12px;
}
</style>