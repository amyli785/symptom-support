<!-- Default page that also displays entries -->

<template>
  <main>
    <section v-if="$store.state.displayName">
      <header>
        <h2>Welcome {{ $store.state.displayName }}</h2>
        <button 
          v-if = "($store.state.entries.length && !sharingMode)" 
          class = "share" 
          @click = "startShare"
        >
          Share
        </button>
      </header>
      <button 
        class = "createEntry" 
        @click = 'createEntry'
      >
        Create Entry
      </button>
      <p v-if="sharingMode">
        Click to select the entries you want to share. 
      </p>
      <section
        v-if="$store.state.entries.length"
        class = "entries"
      >
        <EntryComponent
          v-on:select="selectEntry(entry)"
          v-on:unselect="unselectEntry(entry)"
          v-for="entry in $store.state.entries"
          :key="entry._id"
          :entry="entry"
          :sharingMode="sharingMode"
          :clickable="true"
        />
      </section>
      <section v-else>
        <h3>No entries found</h3>
      </section>
      <ShareBar v-if="($store.state.entries.length && sharingMode)"  
        :sharingMode="sharingMode"
        :shareEntries="shareEntries"
        :shareSize="shareSize"
        v-on:cancel-share="cancelShare"
        v-on:show-share-modal="showShareModal"
      />
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
      <ShareModal 
        :shareEntries="shareEntries"
        v-on:cancel-share="cancelShare"
      />
    </section>
  </main>
</template>

<script>
import EntryComponent from '@/components/Entry/EntryComponent.vue'
import ShareModal from '@/components/Share/ShareModal.vue'
import ShareBar from '@/components/Share/ShareBar.vue'

export default {
  name: 'EntryFeed',
  components: {
    EntryComponent, ShareModal, ShareBar
  },
  data() {
    return {
      alerts: {},
      sharingMode: false,
      shareEntries: {},
      shareSize: 0
    };
  },
  async mounted() {
    this.shareSize = 0;
    this.shareEntries = {};
    await this.$store.commit('refreshEntries');
  },
  methods: {
    showShareModal(){
      this.sharingMode = false;
      this.$bvModal.show('share-modal');
    },
    selectEntry(entry){
      this.shareEntries[entry._id] = entry;
      this.shareSize = Object.keys(this.shareEntries).length;
    },
    unselectEntry(entry){
      delete this.shareEntries[entry._id]
      this.shareSize = Object.keys(this.shareEntries).length;
    },
    startShare(){
      this.sharingMode = !this.sharingMode;
    },
    cancelShare(){
      this.shareSize = 0;
      this.shareEntries = {};
      this.sharingMode = false;
    },
    createEntry(){
      this.$store.commit('goToEntry', {entry: null, owner: this.$store.state.username, status: 'creating', viewOnly: false});
      this.$router.push({name: 'Entry'});
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
.entries {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 40px;
}
.createEntry{
  width: 100%;
  padding: 5px;
  margin-bottom: 25px;
  border-radius: 10px;
}
.share{
  border-radius: 10px;
  width:100px;
  justify-content: center;
}
</style>
