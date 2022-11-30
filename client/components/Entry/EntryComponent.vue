<!-- Reusable component representing a single freet and its actfreet.authorions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class = "entry">
    <div class = "info-side" @click = "viewEntry">
      <p class = "date">
        {{ new Date(this.entry.dateStarted) }}
      </p>
      <p v-if = "entry.dateEnded" class="date">
         - {{ new Date(this.entry.dateEnded)}}
      </p>
      <div v-for="sym in entry.symptoms.slice(0,3)">
        <p class = "sym box">
          {{sym.name}} ({{sym.intensity}}) - {{sym.location}}
        </p>
      </div>
      <div v-if = "entry.symptoms.length < 3">
        <div v-for="i in 3 - entry.symptoms.length">
          <p class = "sym box">
            -
          </p>
        </div>
      </div>
      
      <div v-for="med in entry.medications.slice(0,3)">
        <p class = "med box">
          {{med.name}} ({{med.dosage}})
        </p>
      </div>
      <div v-if = "entry.medications.length < 3">
        <div v-for="i in 3 - entry.medications.length">
          <p class = "med box">
            -
          </p>
        </div>
      </div>
    </div>

    <div class = "icons-side">
      <div class = "top">
        <div
            v-if="flagged" 
            @click="unflag"
            class = "icon black-flag"
        ></div>
        <div
            v-else 
            @click="flag"
            class = "icon white-flag"
        ></div>
      </div>
      
      <div class = "bottom">
          <div 
            class = "icon edit" 
            @click = "editEntry"
          ></div>
          <div 
            class = "icon delete"
            @click = "deleteEntry"
          ></div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'EntryComponent',
  components: {},
  props: {
    // Data from the stored entry
    entry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      flagged: false,
      alerts: {},
    };
  },
  mounted() {
    this.findFlagStatus();
  },
  methods: {
    async deleteEntry() {
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch(`/api/entries/${this.entry._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshEntries');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    editEntry() {
      this.$router.push({name: 'View Entry'});
      this.$store.commit('goToEntry', {entry: this.entry, owner: this.$store.state.username, status: 'editing', viewOnly: false});
    },
    viewEntry() {
      this.$router.push({name: 'View Entry'});//, params: {entry: this.entry}});
      this.$store.commit('goToEntry', {entry: this.entry, owner: null, status: 'viewing', viewOnly: false});
    },
    async unflag(){
      this.flagged = false;
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(`/api/flags/${this.entry._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async flag(){
      this.flagged = true;
      const options = {
        method: 'POST', body: JSON.stringify({entryId: this.entry._id}), headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(`/api/flags/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async findFlagStatus(){
      const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(`/api/flags?entryId=${this.entry._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.flagged = res;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0.25em;
}
.entry {
  border: 2px solid var(--light-blue);
  color: black;
  border-radius: 20px;
  padding: 1.5%;
  margin-bottom: 2%;
  position: relative;
  width: 49%;
  display: flex;
  flex-direction: row;
}
.info-side {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.icons-side {
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.top {
  display: flex;
  flex-direction: row-reverse;
}
.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.date {
  font-weight: bold;
  font-size: medium;
}
.box{
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 3px;
}
.sym{
  background-color: var(--salmon);
}
.med {
  background-color: var(--dark-blue);
}

.icon{
  height:30px;
  width:30px;
  padding:0px;
  margin:0px;
  list-style-type: none;
  cursor: pointer;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center
}
.edit{
  background-image: url("../../public/pencil.png");
}
.delete{
  background-image:url("../../public/trash.png");
}
.white-flag{
  background-image: url("../../public/flag.png");
}
.black-flag{
  background-image: url("../../public/flag-filled.png");
}
.icon:hover {
  transform: scale(1.1, 1.1);
}
</style>