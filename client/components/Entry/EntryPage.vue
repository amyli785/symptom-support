<!-- Default page that also displays entries -->

<template>
  <main>
    <section v-if="$store.state.displayName">
      <header>
        <h2>Welcome {{ $store.state.displayName }}</h2>
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
          to create, edit, and delete entries.
        </h3>
      </article>
    </section>

    <section
      v-if="$store.state.entries.length"
      class = "entries"
    >
      <FreetComponent
        v-for="entry in $store.state.entries"
        :key="entry.id"
        :entry="entry"
      />
    </section>
    <section v-else>
      <h3>No entries found</h3>
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
    //get all entries? submit call to store?
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

button {
  margin-right: 10px;
}
section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
