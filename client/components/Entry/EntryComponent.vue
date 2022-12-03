<template>
  <article :class = "`entry-container ${shareSelected ? 'selected' : 'unselected'}`" @click = "entryClick">
    <div class = "left-content">
      <div class="entry-dates-container">
        <div>
          {{ displayDate(entry.dateStarted) }}
        </div>
        <div v-if = "entry.dateEnded">
          &nbsp;-&nbsp;{{ displayDate(entry.dateEnded) }}
        </div>
      </div>
      <SymptomSingleLine
        :name="''"
        :measurement="''"
        :unit="''"
        :location="''"
        :description = "true"
      />
      <SymptomSingleLine
        v-for="symptom in entry.symptoms.slice(0,2)"
        :key="(entry.dateStarted.toString()+' '+symptom.name+symptom.intensity)"
        :name="symptom.name"
        :measurement="symptom.measurement"
        :unit="symptom.unit"
        :location="symptom.location"
      />
      <SymptomSingleLine
        v-for="i in Math.max(0, 2 - entry.symptoms.length)"
        :key="(entry.dateStarted.toString()+' symptom '+i)"
        :name="''"
        :measurement="''"
        :unit="''"
        :location="''"
      />
      <MedicationSingleLine
        :name="''"
        :dosage="''"
        :description="true"
      />
      <MedicationSingleLine
        v-for="medication in entry.medications.slice(0,2)"
        :key="(entry.dateStarted.toString()+' '+medication.name+medication.dosage)"
        :name="medication.name"
        :dosage="medication.dosage"
      />
      <MedicationSingleLine
        v-for="i in Math.max(0, 2 - entry.medications.length)"
        :key="(entry.dateStarted.toString()+' medication '+i)"
        :name="''"
        :dosage="''"
      />
    </div>

    <div v-if="(!sharingMode && !displayMode)" class = "right-icons">
      <div class = "icons-top">
        <FlagButton :flagged="flagged" @click="toggleFlag" />
      </div>
      
      <div v-if="(!sharingMode && !displayMode)" class = "icons-bottom">
        <EditButton @click="editEntry" />
        <DeleteButton @click="deleteEntry" />
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment';
import SymptomSingleLine from './SymptomSingleLine';
import MedicationSingleLine from './MedicationSingleLine';
import FlagButton from '../common/FlagButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';

export default {
  name: 'EntryComponent',
  components: {
    FlagButton,
    EditButton,
    DeleteButton,
    SymptomSingleLine,
    MedicationSingleLine,
  },
  props: {
    // Data from the stored entry
    entry: {
      type: Object,
      required: true
    },
    sharingMode: {
      type: Boolean,
      required: false
    },
    displayMode: {
      type: Boolean,
      required: false
    },
    clickable: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    sharingMode: function(newVal, oldVal) { 
      if (newVal == false) {
        this.shareSelected = false;
      }
    }
  },
  data() {
    return {
      flagged: false,
      shareSelected: false,
      alerts: {},
    };
  },
  updated() {
    if (this.$store.state.username) {
      this.findFlagStatus();
    }
  },
  methods: {
    displayDate(date) {
      return moment(new Date(date)).format('MMM D, YYYY, h:mm a');
    },
    async deleteEntry() {
      event.stopPropagation();
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
      event.stopPropagation();
      this.$store.commit('goToEntry', {entry: this.entry, owner: this.$store.state.username, status: 'editing', viewOnly: false});
      this.$router.push({name: 'Entry'});
    },
    entryClick() {
      if (this.sharingMode) {
        this.shareEntry()
      } else if (this.clickable){
        this.viewEntry()
      }
    },
    viewEntry() {
      if (this.displayMode) {
        this.$store.commit('goToEntry', {entry: this.entry, owner: null, status: 'viewing', viewOnly: true});
      } else {
        this.$store.commit('goToEntry', {entry: this.entry, owner: null, status: 'viewing', viewOnly: false});
      }

      this.$router.push({name: 'Entry'});
    },
    shareEntry() {
      if (this.shareSelected) {
        this.$emit("unselect");
      } else {
        this.$emit("select");
      }
      this.shareSelected = !this.shareSelected;
    },
    async toggleFlag() {
      event.stopPropagation();
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
      this.$store.commit('refreshFlagged');
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

.entry-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(50% - 20px);

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  gap: 12px;
}

.entry-container:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 4px var(--dark-blue-drop-shadow));
}

.selected {
  background-color: var(--salmon);
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