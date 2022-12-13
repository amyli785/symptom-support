<!-- Default page that also displays entries -->

<template>
  <main>
    <header>
      <h2 v-if="status=='viewing' | status=='editing' | status=='creating'" class="entry-page-header-left">
        <font-awesome-icon @click="back" class="icon-button icon-xxl" icon="fa-solid fa-arrow-left" />
        <div v-if="status=='viewing'">Viewing</div>
        <div v-if="status=='editing'">Editing</div>
        <div v-if="status=='creating'">New</div>
        Entry
      </h2>
      <h2 class="entry-page-header-right">
        <FlagButton 
          v-if="this.status != 'creating'"
          :flagged="entry === null ? false : entry.flag" 
          @click="toggleFlag"
        />
        <EditButton 
          v-if="(!this.viewOnly) && (this.status == 'viewing')"
          @click="editEntry"
        />
        <DeleteButton 
          v-if="(!this.viewOnly) && (this.status !== 'creating')"
          @click="deleteEntryClick"
        />
        <HomeButton />
      </h2>
    </header>
    <article class="entry-page-form">
      <div class="entry-page-dates-container">
        <div class="entry-page-date-container entry-page-box">
          <div class="entry-page-date-label">
            Started <span v-if="!(this.status == 'viewing')" class="required-asterisk">*</span>
          </div>
          <input
            type="datetime-local"
            id="dateStarted"
            class="entry-page-date"
            :value="displayDate(dateStarted)" 
            @input="dateStarted=$event.target.value"
            :max="displayDate(currentDate)"
          />
        </div>
        <div class = "entry-page-date-container entry-page-box">
          <div class = "entry-page-date-label">
            Ended
          </div>
          <input
            type="datetime-local"
            id="dateEnded"
            class="entry-page-date"
            :value="displayDate(dateEnded)" 
            @input="dateEnded = $event.target.value"
            :min = "displayDate(dateStarted)"
            :max = "displayDate(currentDate)"
          />
        </div>
      </div>
      <div class="entry-page-box">
        <div class="entry-page-label">
          Symptoms
        </div>
        <div class="entry-page-category-container">
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
          />
          <div v-if="this.status != 'viewing'" class="entry-page-add-item-container">
            <font-awesome-icon 
              class="entry-page-add-button entry-page-symptom icon-xxl"
              @click="addSymptom"
              icon="fa-solid fa-plus" 
            />
          </div>
        </div>
      </div>
      <div class="entry-page-box">
        <div class="entry-page-label">
          Medications
        </div>
        <div class="entry-page-category-container">
          <MedicationComponent
            v-for="i in medications.length"
            :key="i"
            :viewing="status == 'viewing'"
            :medication="medications[i-1]"
            @update-medication-name="(n) => updateMedicationName(i,n)"
            @update-medication-dosage="(n) => updateMedicationDosage(i,n)"
            @update-medication-unit="(n) => updateMedicationUnit(i,n)"
            @click="deleteMedication(i)"
          />
          <div v-if="this.status != 'viewing'" class="entry-page-add-item-container">
            <font-awesome-icon 
              class="entry-page-add-button entry-page-medication icon-xxl"
              @click="addMedication"
              icon="fa-solid fa-plus" 
            />
          </div>
        </div>
      </div>
      <div class="entry-page-box">
        <div class="entry-page-label">
          <div>Mood</div>
          <font-awesome-icon
            class='icon-xxl'
            v-if="mood == 5"
            icon="fa-solid fa-face-laugh-beam"
          />
          <font-awesome-icon
            class='icon-xxl'
            v-else-if="mood == 4"
            icon="fa-solid fa-face-smile"
          />
          <font-awesome-icon
            class='icon-xxl'
            v-else-if="mood == 3"
            icon="fa-solid fa-face-meh"
          />
          <font-awesome-icon
            class='icon-xxl'
            v-else-if="mood == 2"
            icon="fa-solid fa-face-frown" 
          />
          <font-awesome-icon
            class='icon-xxl'
            v-else-if="mood == 1"
            icon="fa-solid fa-face-sad-tear" 
          />
        </div>
        <div class="entry-page-mood-bar">
          <input 
            type="range" 
            min="1" 
            max="5" 
            :value="mood"
            @input="mood=$event.target.value"
            id="mood-range"
            class="entry-page-mood-slider"
          />
          <div class="entry-page-mood-ticks">
            <font-awesome-icon
              class='icon-m'
              icon="fa-solid fa-face-laugh-beam"
            />
            <font-awesome-icon
              class='icon-m'
              icon="fa-solid fa-face-smile"
            />
            <font-awesome-icon
              class='icon-m'
              icon="fa-solid fa-face-meh"
            />
            <font-awesome-icon
              class='icon-m'
              icon="fa-solid fa-face-frown" 
            />
            <font-awesome-icon
              class='icon-m'
              icon="fa-solid fa-face-sad-tear" 
            />
          </div>
        </div>
      </div>
      <div class="entry-page-box">
        <div class="entry-page-label">
          Notes
        </div>
        <textarea
          :value="notes"
          @input="notes=$event.target.value"
          id="notes"
        ></textarea>
      </div>
      <div v-if="this.status == 'creating'" class="entry-page-footer">
        <button @click="submit" class ="text-button entry-page-create-button">
          Create Entry
          &nbsp;
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
      <div v-else-if="this.status == 'editing'" class="entry-page-footer">
        <button @click="save" class="text-button entry-page-editing-button entry-page-save-button">
          Save Changes
          &nbsp;
          <font-awesome-icon icon="fa-solid fa-check" />
        </button>
        <button @click="discard" class="text-button entry-page-editing-button entry-page-discard-button">
          Discard Changes
          &nbsp;
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </div>
      <ConfirmDeleteModal v-if="this.status !== 'creating' && $store.state.entryStatus.entry" class="modal"
        itemName="this entry"
        itemType="entry"
        :itemId="$store.state.entryStatus.entry._id"
        :deleteFunction="this.deleteEntry"
      />
    </article>
  </main>
</template>

<script>
import moment from 'moment';
import HomeButton from '../common/HomeButtonWithAction';
import FlagButton from '../common/FlagButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import SymptomComponent from './SymptomComponent';
import MedicationComponent from './MedicationComponent';

export default {
  name: 'EntryPage',
  components: {
    HomeButton,
    FlagButton,
    EditButton,
    DeleteButton,
    ConfirmDeleteModal,
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
      mood: 3,
      notes: "",
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
      this.symptoms = this.entry.symptoms.map((obj) => {
        const newObj = {};
        Object.keys(obj).forEach((key, _) => {
          newObj[key] = obj[key];
        });
        return newObj;
      });
      this.medications = this.entry.medications.map((obj) => {
        const newObj = {};
        Object.keys(obj).forEach((key, _) => {
          newObj[key] = obj[key];
        });
        return newObj;
      });
      this.numMedications = this.medications.length;
    }

    if (this.status == 'viewing'){ // lock
      document.getElementById("mood-range").disabled = true;
      document.getElementById("dateStarted").disabled = true;
      document.getElementById("dateEnded").disabled = true;
      document.getElementById("notes").disabled = true;
    }

    if (this.dateStarted == ""){
      this.dateStarted = this.currentDate;
    }

  },
  methods: {
    back() {
      this.$router.back();
    },
    displayDate(date) {
      const formattedDate = moment(new Date(date)).format('yyyy-MM-DDTHH:mm');
      return formattedDate == "Invalid date"? "" : formattedDate;
    },
    addMedication() {
      this.medications.push({name: '',dosage: '', unit: ''});
    },
    deleteMedication(i) {
      this.medications.splice(i-1,1);
    },
    updateMedicationName(i,n) {
      this.medications[i-1].name = n;
    },
    updateMedicationDosage(i,n) {
      this.medications[i-1].dosage = n;
    },
    updateMedicationUnit(i,n) {
      this.medications[i-1].unit = n;
    },
    addSymptom() {
      this.symptoms.push({name: '', location: '', measurement: '', unit: ''});
    },
    deleteSymptom(i) {
      this.symptoms.splice(i-1,1);
    },
    updateSymptomName(i,n) {
      this.symptoms[i-1].name = n;
    },
    updateSymptomLocation(i,n) {
      this.symptoms[i-1].location = n;
    },
    updateSymptomMeasurement(i,n) {
      this.symptoms[i-1].measurement = n;
    },
    updateSymptomUnit(i,n) {
      this.symptoms[i-1].unit = n;
    },
    deleteEntryClick() {
      this.$bvModal.show(`confirm-delete-modal-entry-${this.$store.state.entryStatus.entry._id}`);
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
          this.$store.commit('alert', {
            message: 'Successfully deleted Entry!', status: 'success'
          });

        } catch (e) {
          this.$store.commit('alert', {
            message: e, status: 'error'
          });
        }
      }
    },
    editEntry() {
      document.getElementById("mood-range").disabled = false;
      document.getElementById("dateStarted").disabled = false;
      document.getElementById("dateEnded").disabled = false;
      document.getElementById("notes").disabled = false;
      this.status = 'editing';
    },
    submit() {
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
        method: 'POST',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully created Entry!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    save() {
      const params = {
        body: JSON.stringify({
            dateStarted: this.dateStarted,
            dateEnded: this.dateEnded,
            symptoms: this.symptoms,
            medications: this.medications,
            mood: this.mood,
            notes: this.notes,
        }),
        method: 'PATCH',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully modified Entry!', status: 'success'
          });
        }
      };
      this.request2(params);
    },
    discard() {
      this.status = 'viewing';
      this.dateStarted = this.entry.dateStarted;
      this.dateEnded = this.entry.dateEnded;
      this.mood = this.entry.mood;
      this.notes = this.entry.notes;
      this.symptoms = this.entry.symptoms;
      this.medications = this.entry.medications;
      document.getElementById("mood-range").disabled = true;
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
        if (params.callback){
          params.callback();
        }
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error',
        });
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
        if (this.entry.owner !== this.$store.state.username){
          this.$router.push({ path: '/entries', query: { username: this.entry.owner } })
        }
        else{
          this.$router.push({name: 'Home'});
        }
        this.$store.commit('cleanEntryStatus');
        if (params.callback){
          params.callback();
        }
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
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
            this.$store.commit('alert', {
              message: e, status: 'error'
            });
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
            this.$store.commit('alert', {
              message: e, status: 'error'
            });
          }
        }
      } else {
        const e = 'Missing needed manager permissions to change flag status.';
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
  }
}

</script>

<style scoped>

input:disabled {
  cursor: context-menu;
}

.entry-page-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.entry-page-header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.entry-page-form {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));

  display: flex;
  flex-direction: column;
  align-items: stretch;

  border-radius: 20px;
  padding: 20px;
  gap: 20px;
}

.entry-page-box {
  background-color: var(--light-blue-transparent);

  border-radius: 20px;
  padding: 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  gap: 20px;
}

.entry-page-label {
  flex-basis: 12.5%;
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
}

.entry-page-dates-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.entry-page-date-container {
  flex-basis: calc(50% - 10px);
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.entry-page-date-label {
  flex: 0 1 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.entry-page-date {
  width: 75%;
  border-radius: 5px;
  border: 0px;
}

.entry-page-category-container {
  width: 90%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: white;
  border-radius: 5px;

  padding: 20px;
  gap: 20px;
}

.entry-page-add-item-container {
  flex-basis: calc((100% - 40px)/3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.entry-page-add-button {
  padding: 30px;
  border-radius: 20px;
}
.entry-page-add-button:hover {
  cursor: pointer;
  opacity: 0.75;
}

.entry-page-symptom {
  background-color: var(--salmon-transparent);
}

.entry-page-medication {
  background-color: var(--dark-blue-transparent);
}

.entry-page-mood-bar {
  width: 90%;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: white;
  border-radius: 5px;

  padding: 20px;
  gap: 10px;
}

.entry-page-mood-slider {
  width: 100%;
  accent-color: var(--salmon);
}

.entry-page-mood-ticks {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

#notes {
  width: 90%;
  border: 0;
  border-radius: 5px;
  height: 1.75rem;
  cursor: text;
  overflow: hidden;
	box-sizing: border-box;
}
#notes:disabled {
  cursor: context-menu;
}

.entry-page-footer {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 20px;
}

.entry-page-create-button {
  flex-basis: 100%;
}

.entry-page-editing-button {
  flex-basis: calc(50% - 10px);
  border-width: 2px;
  border-style: solid;
}

.entry-page-save-button {
  background-color: var(--dark-blue);
  border: 2px solid var(--dark-blue);
  color: white;
}

.entry-page-discard-button {
  background-color: white;
  border-color: var(--salmon);
  color: var(--salmon);
}
</style>