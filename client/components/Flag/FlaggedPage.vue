<!-- Page that displays flagged entries -->

<template>
    <main>
        <header>
            <h2>Welcome {{ $store.state.displayName }}</h2>
        </header>
        <section
          v-if="$store.state.flagged.length"
          class = "entries"
        >
          <EntryComponent
            v-for="entry in $store.state.flagged"
            :key="entry.id"
            :entry="entry"
          />
        </section>
        <section v-else>
          <h3>No flagged entries</h3>
        </section>
    </main>
  </template>
  
  <script>
  import EntryComponent from '@/components/Entry/EntryComponent.vue'
  
  export default {
    name: 'EntryPage',
    components: {
      EntryComponent,
    },
    data() {
      return {
        alerts: {},
      };
    },
    mounted() {
      this.$store.commit('refreshFlagged');
    },
    methods: {
    },
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
  
  button {
    margin-right: 10px;
  }
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  
  .entries {
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .createEntry{
    width: 100%;
    padding: 10px;
    margin-bottom: 25px;
  }
  </style>