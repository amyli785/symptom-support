<!-- Default page that also displays entries -->

<template>
  <main>
    <section v-if="$store.state.displayName" class="entry-feed-container">
      <header class="entry-feed-header">
        <h2>Welcome {{ $store.state.displayName }}</h2>
        <button 
          v-if="($store.state.entries.length && !sharingMode)" 
          class="text-button"
          @click="startShare"
        >
          Share
          &nbsp;
          <font-awesome-icon icon="fa-solid fa-share-nodes" />
        </button>
        <div class="share-instructions" v-if="sharingMode">
          Click to select the entries you want to share. 
        </div>
      </header>
      <section class="entry-feed-main">
        <CreateEntryComponent />
        <section
          v-if="$store.state.entries.length"
          class="entries"
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
          <h3>You have no entries.</h3>
        </section>
      </section>
      <ShareBar v-if="($store.state.entries.length && sharingMode)"  
        :sharingMode="sharingMode"
        :shareEntries="shareEntries"
        :shareSize="shareSize"
        v-on:cancel-share="cancelShare"
        v-on:show-share-modal="showShareModal"
      />
      <ShareModal class="modal"
          :shareEntries="shareEntries"
          v-on:cancel-share="cancelShare"
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
    </section>
  </main>
</template>

<script>
import CreateEntryComponent from '@/components/Entry/CreateEntryComponent.vue';
import EntryComponent from '@/components/Entry/EntryComponent.vue';
import ShareModal from '@/components/Share/ShareModal.vue';
import ShareBar from '@/components/Share/ShareBar.vue';

export default {
  name: 'EntryFeed',
  components: {
    CreateEntryComponent, EntryComponent, ShareModal, ShareBar
  },
  data() {
    return {
      alerts: {},
      sharingMode: false,
      shareEntries: {},
      shareSize: 0,
    };
  },
  async mounted() {
    this.shareSize=0;
    this.shareEntries={};

    await this.$store.commit('refreshEntries');
  },
  methods: {
    showShareModal(){
      this.sharingMode=false;
      this.$bvModal.show('share-modal');
    },
    selectEntry(entry){
      this.shareEntries[entry._id]=entry;
      this.shareSize=Object.keys(this.shareEntries).length;
    },
    unselectEntry(entry){
      delete this.shareEntries[entry._id]
      this.shareSize=Object.keys(this.shareEntries).length;
    },
    startShare(){
      this.sharingMode=!this.sharingMode;
    },
    cancelShare(){
      this.shareSize=0;
      this.shareEntries={};
      this.sharingMode=false;
    },
  },
};
</script>

<style scoped>
.entry-feed-container {
  display: flex;
  flex-direction: column;
}

.entry-feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-feed-main {
  display: flex;
  flex-direction: column;

  gap: 40px;
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

.share-instructions {
  font-weight: bold;
}

#entry-selector {
  width:70%;
  border-radius: 10px;
  overflow: hidden;
}

.modal {
  padding: 0 !important;
}
</style>
