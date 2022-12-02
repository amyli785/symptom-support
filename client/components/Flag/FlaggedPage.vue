<!-- Page that displays flagged entries -->

<template>
    <main>
        <header>
            <h2>Flagged Entries</h2>
        </header>
        <section
          v-if="$store.state.flagged.length"
          class = "entries"
        >
          <EntryComponent
            v-for="entry in $store.state.flagged"
            :key="entry.id"
            :entry="entry"
            :clickable="true"
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
section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
}
.entries {
    display: flex;

    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    gap: 40px;
}
</style>