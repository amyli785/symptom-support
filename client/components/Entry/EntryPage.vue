<!-- Default page that also displays entries -->

<template>
  <main>
    <header>
      <h2 v-if = "this.status == 'viewing'"> Viewing Entry </h2>
      <h2 v-else-if = "this.status == 'editing'"> Editing Entry </h2>
      <h2 v-else-if = "this.status == 'creating'"> New Entry </h2>
      <div v-if = "!this.viewOnly" class = "icons">
        <FlagButton 
          :flagged="flagged" 
          @click="toggleFlag"
        />
        <EditButton 
          v-if = "this.status == 'viewing'"
          @click="editEntry"
        />
        <DeleteButton 
          @click="deleteEntry"
        />
      </div>
    </header>
    <article class = "form">
      <div class = "dates">
        <div class = "started time box">
          <p>Started:</p>
          <input
            type = "datetime-local"
            id = "dateStarted"
            class = "date"
            :value="displayDate(dateStarted)" 
            @input="dateStarted = $event.target.value"
          />
        </div>
        <div class = "ended time box">
          <p>Ended:</p>
          <input
            type="datetime-local"
            id="dateEnded"
            class="date"
            :value="displayDate(dateEnded)" 
            @input="dateEnded = $event.target.value"
          />
        </div>
      </div>
      <div class = "syms">
        <div class = "full box">
          <p>Symptoms:</p>
          <div class = "all">
          </div>
        </div>
      </div>
      <div class = "meds">
        <div class = "full box">
          <p>Medications:</p>
          <div class = "all">
          </div>
        </div>
      </div>
      <div class = "mood">
        <div class = "full box">
          <p>Mood:</p>
          <div class = "all">
            <input 
              type = "range" 
              min = "1" 
              max = "10" 
              :value = "mood"
              @input="mood = $event.target.value"
              id = "moodRange"
              class = "slider" 
            />
          </div>
        </div>
      </div>
      <div class = "notes">
        <div class = "full box">
          <p>Notes:</p>
          <input
            type="text"
            :value="notes"
            @input="notes = $event.target.value"
            id = "notes"
          />
        </div>
      </div>
      <div class = "end">
        <div v-if = "this.status == 'creating'">
          <button @click = "submit" class ="b creating">
            Create Entry
          </button>
        </div>
        <div v-else-if = "this.status == 'editing'" class = "both">
          <button @click = "save" class = "b editing">
            Save Changes
          </button>
          <button @click = "discard" class = "b editing">
            Discard Changes
          </button>
        </div>
      </div>
    </article>
  </main>
</template>

<script>
import moment from 'moment';
import FlagButton from '../common/FlagButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';

export default {
  name: 'EntryPage',
  components: {
    FlagButton,
    EditButton,
    DeleteButton,
  },
  props: {},
  data() {
    return {
      entry: null,
      status: null,
      viewOnly: false,
      flagged: false,
      owner: "",
      dateStarted: "",
      dateEnded: "",
      symptoms: [],
      medications: [],
      mood: 5,
      notes: "",
      alerts: {},
    };
  },
  async mounted(){
    let entryStatus = this.$store.state.entryStatus;
    this.entry = entryStatus.entry;
    this.owner = entryStatus.owner;
    this.status = entryStatus.status;
    this.viewOnly = entryStatus.viewOnly;
    await this.findFlagStatus();

    if (this.status !== 'creating'){//prepopulate
      this.dateStarted = this.entry.dateStarted;
      this.dateEnded = this.entry.dateEnded;
      this.mood = this.entry.mood;
      this.notes = this.entry.notes;
      this.symptoms = this.entry.symptoms;
      this.medications = this.entry.medications;
    }

    if (this.status == 'viewing'){//lock
      document.getElementById("moodRange").disabled = true;
      document.getElementById("dateStarted").disabled = true;
      document.getElementById("dateEnded").disabled = true;
      document.getElementById("notes").disabled = true;
    }

  },
  methods: {
    displayDate(date) {
      let formattedDate = moment(new Date(date)).format('yyyy-MM-DDThh:mm');
      return formattedDate == "Invalid date"? "" : formattedDate;
    },
    async deleteEntry() {
      if (this.status == 'creating'){
        this.$router.push({name: 'Home'});
        this.$store.commit('cleanEntry');
      } else {
        const options = {
          method: 'DELETE', headers: {'Content-Type': 'application/json'}
        };

        try {
          const r = await fetch(`/api/entries/${this.entry._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }

          await this.$store.commit('refreshEntries');
          this.$router.push({name: 'Home'});
          this.$store.commit('cleanEntry');

        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    },
    editEntry() {
      document.getElementById("moodRange").disabled = false;
      document.getElementById("dateStarted").disabled = false;
      document.getElementById("dateEnded").disabled = false;
      document.getElementById("notes").disabled = false;
      this.status = 'editing';
    },
    submit(){
      const params = {
        body: JSON.stringify({
            owner: this.owner,
            dateStarted: this.dateStarted,
            dateEnded: this.dateEnded,
            symptoms: this.symptoms,
            medications: this.medications,
            mood: this.mood,
            notes: this.notes,
        }),
        message: 'Successfully created Entry!',
        method: 'POST',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    save(){
      const params = {
        body: JSON.stringify({
            dateStarted: this.dateStarted,
            dateEnded: this.dateEnded,
            symptoms: this.symptoms,
            medications: this.medications,
            mood: this.mood,
            notes: this.notes,
        }),
        message: 'Successfully modified Entry!',
        method: 'PATCH',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request2(params);
    },
    discard(){
      this.status = 'viewing';
      this.dateStarted = this.entry.dateStarted;
      this.dateEnded = this.entry.dateEnded;
      this.mood = this.entry.mood;
      this.notes = this.entry.notes;
      this.symptoms = this.entry.symptoms;
      this.medications = this.entry.medications;
      document.getElementById("moodRange").disabled = true;
      document.getElementById("dateStarted").disabled = true;
      document.getElementById("dateEnded").disabled = true;
      document.getElementById("notes").disabled = true;
    },
    async request(params){
      const options = {
        method: params.method,
        body: params.body,
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(`/api/entries/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        await this.$store.commit('refreshEntries');
        this.$router.push({name: 'Home'});
        this.$store.commit('cleanEntry');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async request2(params){
      const options = {
        method: params.method,
        body: params.body,
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(`/api/entries/${this.entry._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        await this.$store.commit('refreshEntries');
        this.$router.push({name: 'Home'});
        this.$store.commit('cleanEntry');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async toggleFlag() {
      if (this.flagged){
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
      } else {
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
}

</script>

<style scoped>
p {
  padding: 0;
  margin: 0; 
}
.form {
  height: 100%;
  border-radius: 25px;
  background-color: var(--dark-blue);
  padding: 25px;
}
.dates{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.time {
  width: 47.5%;
}
.full {
  width: 100%;
}
.box {
  background-color: var(--light-blue);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;;
}
.date-time {
  width: 80%;
  background-color: white;
  border-radius: 5px;
}
.date{
  width:67.5%;
  border-radius: 5px;
  border: 0px;
}
.strip{
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
.all {
  width: 85%;
  background-color: white;
  border-radius: 5px;
  padding: 10px;
}
#moodRange {
  width: 100%;
}
#notes {
  width: 85%;
  border: 0;
  border-radius: 5px;;
}
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.icons{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.icon{
  height: 30px;
  width: 30px;
  padding: 0px;
  margin: 0px;
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
.end {
  width: 100%;
}
.editing{
  width: 49%;
}
.creating{
  width: 100%;
}
.b{
  padding: 10px;
}
.both{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>