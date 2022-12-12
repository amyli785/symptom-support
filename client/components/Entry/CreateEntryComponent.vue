<template>
  <div class="create-entry-container">
    <div class="create-entry-main">
      <div> Create an entry for&nbsp;</div>
      <select
        class="create-entry-select"
        id="entry-selector"
      >
        <option
          v-for="person in this.people"
          :value="person.username"
        >
          {{person.username == $store.state.username ? 'myself': person.display + ' @' + person.username}}
        </option>
      </select>
    </div>
    <button 
      class="text-button" 
      @click='createEntry'
    >
      Create
      &nbsp;
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'CreateEntryComponent',
  data() {
    return {
      alerts: {},
      people: [{username: this.$store.state.username},],
    };
  },
  async mounted() {
    this.getPeople();
  },
  methods: {
    async getPeople() {
      const url = `/api/supports/supported?inviteStatus=accepted`;
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

      this.people = [{username: this.$store.state.username},];
      for (const s of this.$store.state.supported) {
        if (s.permission == 'creator' || s.permission == 'manager'){
          this.people.push({display: s.supportedDisplay, username: s.supported});
        }
      }
    },
    createEntry() {
      this.$store.commit('goToEntry', {entry: null, owner: document.getElementById("entry-selector").value, status: 'creating', viewOnly: false});
      this.$router.push({name: 'Entry'});
    },
  },
};
</script>

<style scoped>

.create-entry-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  border-radius: 20px;
  padding: 20px;

  flex-basis: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 20px;
}

.create-entry-main {
  flex: 0 1 100%;
  display: flex;
  flex-direction: row;

  font-size: x-large;
  white-space: nowrap;
}

.create-entry-select {
  margin: 0;
  padding: 0;
  
  flex-basis: 100%;
}

</style>
