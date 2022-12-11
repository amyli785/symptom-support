<!-- Default page that also displays entries -->

<template>
  <main>
    <header>
      <h2 v-if = "this.status == 'viewing'"> <font-awesome-icon @click = "back" class = "icon" icon="fa-solid fa-arrow-left" /> &nbsp; Viewing Entry </h2>
      <h2 v-else-if = "this.status == 'editing'"> <font-awesome-icon @click = "back" class = "icon" icon="fa-solid fa-arrow-left" /> &nbsp; Editing Entry </h2>
      <h2 v-else-if = "this.status == 'creating'"> <font-awesome-icon @click = "back" class = "icon" icon="fa-solid fa-arrow-left" /> &nbsp; New Entry </h2>
      <div v-if = "!this.viewOnly" class = "icons">
        <FlagButton 
          :flagged="entry === null ? false : entry.flag" 
          @click="toggleFlag"
        />
        <EditButton 
          v-if = "this.status == 'viewing'"
          @click="editEntry"
        />
        <DeleteButton 
          @click="deleteEntry"
        />
        <h2><font-awesome-icon @click ="goHome" class = "icon" icon="fa-solid fa-house" /></h2>
      </div>
    </header>
    <article class = "form">
      <div class = "dates">
        <div class = "started time box">
          <div class = "label-time">
            <p>Started:</p>  
          </div>
          <input
            type = "datetime-local"
            id = "dateStarted"
            class = "date"
            :value="displayDate(dateStarted)" 
            @input="dateStarted = $event.target.value"
            :max = "displayDate(currentDate)"
          />
        </div>
        <div class = "ended time box">
          <div class = "label-time">
            <p>Ended:</p>  
          </div>
          <input
            type="datetime-local"
            id="dateEnded"
            class="date"
            :value="displayDate(dateEnded)" 
            @input="dateEnded = $event.target.value"
            :min = "displayDate(dateStarted)"
            :max = "displayDate(currentDate)"
          />
        </div>
      </div>
      <div class = "syms">
        <div class = "full box">
          <div class = "label">
            <p>Symptoms:</p>
            <div class = "label-icon">
              <font-awesome-icon 
                class = "icon"
                v-if="this.status != 'viewing'"
                @click="addSymptom"
                icon="fa-solid fa-plus" 
              />
            </div>
          </div>
          <div class = "all sm">
            <SymptomComponent
              v-for="j in symptoms.length"
              :key="j"
              :viewing="status == 'viewing'"
              :symptom="symptoms[j-1]"
              @update-symptom-name="(n) => updateSymptomName(j,n)"
              @update-symptom-location="(n) => updateSymptomLocation(j,n)"
              @update-symptom-measurement="(n) => updateSymptomMeasurement(j,n)"
              @update-symptom-unit="(n) => updateSymptomUnit(j,n)"
              @click="deleteSymptom(j)"
              class = "s"
            />
          </div>
        </div>
      </div>
      <div class = "meds">
        <div class = "full box">
          <div class = "label">
            <p>Medications:</p>
            <div class = "label-icon">
              <font-awesome-icon 
                  class = "icon"
                  v-if="this.status != 'viewing'"
                  @click="addMedication"
                  icon="fa-solid fa-plus" 
              /> 
            </div> 
          </div>
          <div class = "all sm">
            <MedicationComponent
              v-for="i in medications.length"
              :key="i"
              :viewing="status == 'viewing'"
              :medication="medications[i-1]"
              @update-medication-name="(n) => updateMedicationName(i,n)"
              @update-medication-dosage="(n) => updateMedicationDosage(i,n)"
              @click="deleteMedication(i)"
              class = "m"
            />
          </div>
        </div>
      </div>
      <div class = "mood">
        <div class = "full box">
          <div class = "label">
            <p>Mood:</p>
            <font-awesome-icon
              class = 'i'
              v-if = "mood == 5"
              icon = "fa-solid fa-face-laugh-beam"
            />
            <font-awesome-icon
              class = 'i'
              v-else-if = "mood == 4"
              icon = "fa-solid fa-face-smile"
            />
            <font-awesome-icon
              class = 'i'
              v-else-if = "mood == 3"
              icon = "fa-solid fa-face-meh"
            />
            <font-awesome-icon
              class = 'i'
              v-else-if = "mood == 2"
              icon = "fa-solid fa-face-frown" 
            />
            <font-awesome-icon
              class = 'i' 
              v-else-if = "mood == 1"
              icon = "fa-solid fa-face-sad-tear" 
            />
          </div>
          <div class = "all">
            <input 
              type = "range" 
              min = "1" 
              max = "5" 
              :value = "mood"
              @input="mood = $event.target.value"
              id = "moodRange"
              class = "slider" 
              list="steplist"
            />
            <datalist id="steplist">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </datalist>
            <div class = "ticks">
              <font-awesome-icon
                class = 'i-small'
                icon = "fa-solid fa-face-laugh-beam"
              />
              <font-awesome-icon
                class = 'i-small'
                icon = "fa-solid fa-face-smile"
              />
              <font-awesome-icon
                class = 'i-small'
                icon = "fa-solid fa-face-meh"
              />
              <font-awesome-icon
                class = 'i-small'
                icon = "fa-solid fa-face-frown" 
              />
              <font-awesome-icon
                class = 'i-small'
                icon = "fa-solid fa-face-sad-tear" 
              />
            </div>
          </div>
        </div>
      </div>
      <div class = "notes">
        <div class = "full box">
          <div class = "label">
            <p>Notes:</p>
          </div>
          <textarea
            :value="notes"
            @input="notes = $event.target.value"
            id = "notes"
          ></textarea>
        </div>
      </div>
      <div class = "end">
        <div v-if = "this.status == 'creating'">
          <button @click = "submit" class ="b creating">
            Create Entry
            &nbsp;
            <font-awesome-icon icon="fa-solid fa-plus" />
          </button>
        </div>
        <div v-else-if = "this.status == 'editing'" class = "both">
          <button @click = "save" class = "b editing save">
            Save Changes
            &nbsp;
            <font-awesome-icon icon="fa-solid fa-check" />
          </button>
          <button @click = "discard" class = "b editing discard">
            Discard Changes
            &nbsp;
            <font-awesome-icon icon="fa-solid fa-x" />
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
import SymptomComponent from './SymptomComponent';
import MedicationComponent from './MedicationComponent';

export default {
  name: 'EntryPage',
  components: {
    FlagButton,
    EditButton,
    DeleteButton,
    SymptomComponent,
    MedicationComponent
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
      currentDate: (new Date()).toString(),
    };
  },
  async mounted(){
    const entryStatus = this.$store.state.entryStatus;
    this.entry = entryStatus.entry;
    this.owner = entryStatus.owner;
    this.status = entryStatus.status;
    this.viewOnly = entryStatus.viewOnly;

    if (this.status !== 'creating'){ // prepopulate
      this.dateStarted = this.entry.dateStarted;
      this.dateEnded = this.entry.dateEnded;
      this.mood = this.entry.mood;
      this.notes = this.entry.notes;
      this.symptoms = this.entry.symptoms;
      this.medications = this.entry.medications;
      this.numMedications = this.medications.length;
    }

    if (this.status == 'viewing'){ //lock
      document.getElementById("moodRange").disabled = true;
      document.getElementById("dateStarted").disabled = true;
      document.getElementById("dateEnded").disabled = true;
      document.getElementById("notes").disabled = true;
    }

    if (this.dateStarted == ""){
      this.dateStarted = currentDate;
    }

  },
  methods: {
    goHome(){
      this.$router.push({name: 'Home'});
    },
    back(){
      this.$router.back();
    },
    displayDate(date) {
      const formattedDate = moment(new Date(date)).format('yyyy-MM-DDTHH:mm');
      return formattedDate == "Invalid date"? "" : formattedDate;
    },
    addMedication(){
      this.medications.push({name: '',dosage: ''});
    },
    deleteMedication(i){
      this.medications.splice(i-1,1);
    },
    updateMedicationName(i,n){
      this.medications[i-1].name = n;
    },
    updateMedicationDosage(i,n){
      this.medications[i-1].dosage = n;
    },
    addSymptom(){
      this.symptoms.push({name: '', location: '', measurement: '', unit: ''});
    },
    deleteSymptom(i){
      this.symptoms.splice(i-1,1);
    },
    updateSymptomName(i,n){
      this.symptoms[i-1].name = n;
    },
    updateSymptomLocation(i,n){
      this.symptoms[i-1].location = n;
    },
    updateSymptomMeasurement(i,n){
      this.symptoms[i-1].measurement = n;
    },
    updateSymptomUnit(i,n){
      this.symptoms[i-1].unit = n;
    },
    async deleteEntry() {
      if (this.status == 'creating'){
        this.$router.push({name: 'Home'});
        this.$store.commit('cleanEntryStatus');
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
          this.$store.commit('cleanEntryStatus');

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
        if (this.owner && this.owner !== this.$store.state.username){
          this.$router.push({ path: '/entries', query: { username: this.owner } })
        }
        else{
          this.$router.push({name: 'Home'});
        }
        this.$store.commit('cleanEntryStatus');
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
        this.$store.commit('cleanEntryStatus');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async toggleFlag() {
      if (this.$store.state.username === this.entry.owner || this.permission === 'manager') {
        if (this.entry.flag) {
          const options = {
            method: 'DELETE', headers: {'Content-Type': 'application/json'}
          };
          try {
            const r = await fetch(`/api/flags/${this.entry._id}`, options);
            const res = await r.json();
            if (!r.ok) {
              throw new Error(res.error);
            }
            this.$store.commit('updateEntryFlag', res.entry);
          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        } else {
          const options = {
            method: 'POST', body: JSON.stringify({entryId: this.entry._id}), headers: {'Content-Type': 'application/json'}
          };
          try {
            const r = await fetch(`/api/flags/`, options);
            const res = await r.json();
            if (!r.ok) {
              throw new Error(res.error);
            }
            this.$store.commit('updateEntryFlag', res.entry);
          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        }
      } else {
        const e = 'Missing needed manager permissions to change flag status.';
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
}

</script>

<style scoped>
h2 {
  margin:0 ;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

p {
  padding: 0;
  margin: 0; 
}

.form {
  height: 100%;
  border-radius: 25px;
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  padding: 20px;
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
  background-color: var(--light-blue-transparent);
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
  width: 67.5%;
  border-radius: 5px;
  border: 0px;
}

.label-time{
  width: 27.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.all {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 85%;
  background-color: white;
  border-radius: 5px;
}

.label {
  width: 12.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#moodRange {
  width: 100%;
}

#notes {
  width: 85%;
  border: 0;
  border-radius: 5px;
  cursor: text;
  overflow: hidden;
	box-sizing: border-box;
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

.end {
  width: 100%;
}

.editing {
  width: 49%;
}

.creating {
  width: 100%;
}

.b {
  padding: 10px;
  border-radius: 15px;
}

.both {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.i {
  font-size: 40px;
}

.icon {
  font-size: 40px;
}

.icon:hover {
  transform: scale(1.1, 1.1);
  cursor: pointer;
}

input {
  cursor: pointer;
}

input:disabled {
  cursor: context-menu;
}

#notes:disabled {
  cursor: context-menu;
}

.s {
  margin: 1.65%;
}

.m {
  margin: 1.65%;
}

.label-icon {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slider {
  margin: 0 20px 0 20px;
  accent-color: var(--salmon);
}

textarea {
  border: 0px;
  border-radius: 5px;
  height: 1.75em;
}

.i-small {
  font-size: 20px;
}

.ticks {
  margin: 0 18px 0 18px;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.save {
  color: rgba(0,155,0, 1);
}

.discard {
  color: rgba(200,0, 0, 1);
}
</style>