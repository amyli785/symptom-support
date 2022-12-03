<!-- Page that displays flagged entries -->

<template>
    <main>
        <header>
            <h2>Flagged Entries</h2>
            <button 
                @click = "startShare"
                class = "share"
            >
                Share
                &nbsp;
                <font-awesome-icon icon="fa-solid fa-share-nodes" />
            </button>
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
        <ShareModal 
            :shareEntries="flaggedEntries"
        />
    </main>
</template>

<script>
import EntryComponent from '@/components/Entry/EntryComponent.vue'
import ShareModal from '@/components/Share/ShareModal.vue'
export default {
    name: 'EntryPage',
    components: {
        EntryComponent, ShareModal
    },
    data() {
        return {
        alerts: {},
        flaggedEntries: {}
        };
    },
    async mounted() {
        await this.$store.commit('refreshFlagged')
        for (const entry of this.$store.state.flagged){
            this.flaggedEntries[entry._id] = entry;
        }
    },
    methods: {
        startShare(){
            this.$bvModal.show('share-modal');
        }
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

header{
    display: flex;
    flex-direction: row;
}
.entries {
    display: flex;

    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    gap: 40px;
}
.share{
  border-radius: 10px;
  width:100px;
  justify-content: center;
}
</style>