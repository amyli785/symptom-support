<!-- Page that displays flagged entries -->

<template>
    <main>
        <header>
            <h2> <font-awesome-icon @click = "back" class = "icon" icon="fa-solid fa-arrow-left" /> &nbsp; Flagged Entries </h2>
            <div class="header-right">
                <button 
                    @click = "startShare"
                    class = "share"
                >
                    Share
                    &nbsp;
                    <font-awesome-icon icon="fa-solid fa-share-nodes" />
                </button>
                <h2><font-awesome-icon @click ="goHome" class = "icon" icon="fa-solid fa-house" /></h2>
            </div>
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
    name: 'FlaggedPage',
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
        goHome(){
            this.$router.push({name: 'Home'});
        },
        back() {
            this.$router.push({name: 'Home'});
        },
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
h2 {
  margin: 0;
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

.header-right{
    display: flex;
    gap: 10px;
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
.icon{
  font-size: 40px;
}
.icon:hover {
  transform: scale(1.1, 1.1);
  cursor: pointer;
}
</style>