<!-- Page that displays flagged entries -->

<template>
    <main>
        <header>
            <h2> Flagged Entries </h2>
            <div class="header-right">
                <button 
                    v-if="Object.keys(this.flaggedEntries).length > 0"
                    @click = "startShare"
                    class = "text-button"
                >
                    Share
                    &nbsp;
                    <font-awesome-icon icon="fa-solid fa-share-nodes" />
                </button>
                <h2><font-awesome-icon @click="goHome" class="icon-button" icon="fa-solid fa-house" /></h2>
            </div>
        </header>
        <section
          v-if="Object.keys(this.flaggedEntries).length > 0"
          class="entries"
        >
          <EntryComponent
            v-for="entry in flaggedEntries"
            :key="entry._id"
            :entry="entry"
            :clickable="true"
            @flagToggled="refreshFlagged"
            @deleted="refreshFlagged"
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
import XButton from '@/components/common/XButton.vue';
import EntryComponent from '@/components/Entry/EntryComponent.vue';
import ShareModal from '@/components/Share/ShareModal.vue';

export default {
    name: 'FlaggedPage',
    components: {
        XButton, EntryComponent, ShareModal,
    },
    data() {
        return {
            alerts: {},
            flaggedEntries: {},
        };
    },
    mounted() {
        this.refreshFlagged();
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
        },
        async refreshFlagged() {
            const url = `/api/flags?username=${this.$store.state.username}`;
            const res = await fetch(url).then(async r => r.json());
            const flaggedEntries = {};
            for (const entry of res){
                flaggedEntries[entry._id] = entry;
            }
            this.flaggedEntries = flaggedEntries;
        },
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
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

</style>