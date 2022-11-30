<template>
  <article class = "entry-container">
    <div class = "left-content" @click = "viewEntry">
      <div class="entry-dates-container">
        <div>
          {{ displayDate(entry.dateStarted) }}
        </div>
        <div v-if = "entry.dateEnded">
          &nbsp;-&nbsp;{{ displayDate(entry.dateEnded) }}
        </div>
      </div>
      <SymptomComponent
        v-for="symptom in entry.symptoms.slice(0,3)"
        :key="(entry.dateStarted.toString()+' '+symptom.name+symptom.intensity)"
        :name="symptom.name"
        :intensity="symptom.intensity"
        :location="symptom.location"
      />
      <SymptomComponent
        v-for="i in Math.max(0, 3 - entry.symptoms.length)"
        :key="(entry.dateStarted.toString()+' symptom '+i)"
        :name="''"
        :intensity="''"
        :location="''"
      />
      
      <MedicationComponent
        v-for="medication in entry.medications.slice(0,3)"
        :key="(entry.dateStarted.toString()+' '+medication.name+medication.dosage)"
        :name="medication.name"
        :dosage="medication.dosage"
      />
      <MedicationComponent
        v-for="i in Math.max(0, 3 - entry.medications.length)"
        :key="(entry.dateStarted.toString()+' medication '+i)"
        :name="''"
        :dosage="''"
      />
    </div>

    <div class = "right-icons">
      <div class = "icons-top">
        <FlagButton :flagged="flagged" @click="toggleFlag" />
      </div>
      
      <div class = "icons-bottom">
        <EditButton @click="editEntry" />
        <DeleteButton @click="deleteEntry" />
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment';
import SymptomComponent from './SymptomComponent';
import MedicationComponent from './MedicationComponent';
import FlagButton from '../common/FlagButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';

export default {
  name: 'EntryComponent',
  components: {
    FlagButton,
    EditButton,
    DeleteButton,
    SymptomComponent,
    MedicationComponent,
  },
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
  async mounted() {
    // find if entry is flagged
  },
  methods: {
    displayDate(date) {
      return moment(new Date(date)).format('MMM D, YYYY, h:mm a');
    },
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
      this.$router.push({name: 'View Entry'}); // params: {entry: this.entry}});
      this.$store.commit('goToEntry', {entry: this.entry, owner: null, status: 'viewing', viewOnly: false});
    },
    toggleFlag() {
      this.flagged = !this.flagged;
    },
  }
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0.25em;
}
.entry-container {
  border: 2px solid var(--light-blue);
  /* border: 0 none; */
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(50% - 40px);

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  gap: 12px;
}
.left-content {
  flex: 0 1 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  gap: 4px;
}
.right-icons {
  flex: 1 0 0%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.icons-top {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 12px;
}

.icons-bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 12px;
}

.entry-dates-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding: 0 8px;

  font-weight: bold;
  font-size: medium;
}

</style>