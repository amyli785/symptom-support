<!-- Default page that also displays entries -->

<template>
  <main>
    <section v-if="$store.state.displayName">
      <header>
        <h2>Welcome {{ $store.state.displayName }}</h2>
        <button 
          v-if = "($store.state.entries.length && !sharingMode)" 
          class = "b share"
          @click = "startShare"
        >
          Share
          &nbsp;
          <font-awesome-icon icon="fa-solid fa-share-nodes" />
        </button>
      </header>
      <div class = "create-entry">
        <div class = "right">
          <p class = "create-words"> Create an Entry for: &nbsp;</p>
          <select
            class = "create-words"
            id = "entry-selector"
          >
            <option
              v-for="person in this.people"
              :value = "person.username"
            >{{person.username == $store.state.username? 'myself': person.display + ' @' + person.username}}</option>
          </select>
        </div>
        <button 
          class = "b create" 
          @click = 'createEntry'
        >
          Create&nbsp;<font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
      
      <p class="shareInstructions" v-if="sharingMode">
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
        <h3>You have no entries.</h3>
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
    </section>
    <ShareModal 
        :shareEntries="shareEntries"
        v-on:cancel-share="cancelShare"
    />
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
      shareSize: 0,
      people:[{username: this.$store.state.username},],
    };
  },
  async mounted() {
    this.shareSize = 0;
    this.shareEntries = {};

    let url = `/api/supports/supported?inviteStatus=accepted`;
    try {
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.$store.commit('updateSupported', res);
    } catch (e) {

      this.$set(this.alerts, e, 'error');
      setTimeout(() => this.$delete(this.alerts, e), 3000);
    }
    for(const s of this.$store.state.supported){
      if (s.permission == 'creator' || s.permission == 'manager'){
        this.people.push({display:s.supportedDisplay, username:s.supported});
        //this.people.push(s.supportedDisplay +  " @" + s.supported);
      }
    }

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
      this.$store.commit('goToEntry', {entry: null, owner: document.getElementById("entry-selector").value, status: 'creating', viewOnly: false});
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
.entries {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 40px;
}
.b{
  border-radius: 10px;
  width:100px;
  justify-content: center;
}

.shareInstructions{
  font-weight: bold;
}
.create-entry{
  width:100%;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 15px;
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  padding: 5px;
  margin-bottom: 25px;
}
.create-words{
  margin:0;
  padding:0;
  font-size: 1.5em;
}
#entry-selector{
  width:70%;
  border-radius: 10px;
  overflow: hidden;
}
.right{
  width:100%;
  display:flex;
  flex-direction: row;
}
</style>
