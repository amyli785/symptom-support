<template>
  <article :class="`entry-container ${shareSelected ? 'selected' : 'unselected'}`" @click="entryClick">
    <div class="entry-left-content">
      <div class="entry-dates-container">
        <div>
          {{ displayDate(entry.dateStarted) }}
        </div>
        <div v-if="entry.dateEnded">
          &nbsp;-&nbsp;{{ displayDate(entry.dateEnded) }}
        </div>
      </div>
      <div class="entry-category-container entry-category-symptoms">
        <SymptomSingleLine
          :name="''"
          :measurement="''"
          :unit="''"
          :location="''"
          :description="true"
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
          v-if="(entry.symptoms.length > 2)"
          :name="''"
          :measurement="''"
          :unit="''"
          :location="''"
          :description="true"
          :extra="true"
        />
      </div>
      <div class="entry-category-container entry-category-medications">
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
          v-if="(entry.medications.length > 2)"
          :name="''"
          :dosage="''"
          :description="true"
          :extra="true"
        />
      </div>
      <div class="entry-category-container entry-notes-container">
        <div class="entry-notes">
          Notes: {{this.entry.notes}}
        </div>
      </div>
    </div>

    <div v-if="(!sharingMode && !displayMode)" class="entry-right-icons icon-xl">
      <div class="entry-icons-top">
        <FlagButton 
          v-if="(permission == 'viewer' || permission == 'creator' || permission == 'manager' || entry.owner == this.$store.state.username)"
          :flagged="entry.flag" @click="toggleFlag" />
      </div>
      
      <div class="entry-icons-bottom">
        <EditButton 
          v-if="(permission == 'manager' || entry.owner == this.$store.state.username)"
          @click="editEntry" />
        <DeleteButton 
          v-if="(permission == 'manager' || entry.owner == this.$store.state.username)" 
          @click="deleteEntryClick" />
      </div>
    </div>
    <ConfirmDeleteModal class="modal"
      itemName="this entry"
      itemType="entry"
      :itemId="entry._id"
      :deleteFunction="this.deleteEntry"
    />
  </article>
</template>

<script>
import moment from 'moment';
import SymptomSingleLine from './SymptomSingleLine';
import MedicationSingleLine from './MedicationSingleLine';
import FlagButton from '../common/FlagButton';
import EditButton from '../common/EditButton';
import DeleteButton from '../common/DeleteButton';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

export default {
  name: 'EntryComponent',
  components: {
    FlagButton,
    EditButton,
    DeleteButton,
    SymptomSingleLine,
    MedicationSingleLine,
    ConfirmDeleteModal,
  },
  props: {
    // Data from the stored entry
    entry: {
      type: Object,
      required: true,
    },
    sharingMode: {
      type: Boolean,
      required: false,
    },
    displayMode: {
      type: Boolean,
      required: false,
    },
    clickable: {
      type: Boolean,
      required: false,
    },
    permission: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      required: false,
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
      shareSelected: false,
    };
  },
  methods: {
    displayDate(date) {
      return moment(new Date(date)).format('MMM D, YYYY, h:mm a');
    },
    deleteEntryClick(){
      event.stopPropagation();
      this.$bvModal.show(`confirm-delete-modal-entry-${this.entry._id}`);
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
        this.$emit('deleted');
        this.$store.commit('alert', {
            message: 'Successfully deleted Entry!', status: 'success'
        });
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    editEntry() {
      event.stopPropagation();
      this.$store.commit('goToEntry', {entry: this.entry, owner: this.$store.state.username, status: 'editing', viewOnly: false});
      this.$router.push({name: 'Entry'});
    },
    entryClick() {
      if (this.sharingMode) {
        this.shareEntry();
      } else if (this.clickable){
        this.viewEntry();
      }
    },
    viewEntry() {
      if (this.displayMode || !this.$store.state.username || this.permission === 'viewer' || this.permission == 'creator') {
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
            
            this.$store.commit('alert', {
              message: 'Successfully unflagged entry!', status: 'success'
            });
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
            this.$store.commit('alert', {
              message: 'Successfully flagged entry!', status: 'success'
            });
          } catch (e) {
            this.$store.commit('alert', {
              message: e, status: 'error'
            });
          }
        }
        this.$emit('flagToggled');
      } else {
        const e = 'Missing needed manager permissions to change flag status.';
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
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

  gap: 10px;
  height: 450px;
}

.entry-container:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 4px var(--dark-blue-drop-shadow));
}

.selected:hover{
  filter: drop-shadow(0 0 8px var(--dark-blue));
}

.selected {
  filter: drop-shadow(0 0 6px var(--dark-blue));
}

.entry-left-content {
  flex: 0 1 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  gap: 5px;
}

.entry-dates-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding: 0;

  font-weight: bold;
  font-size: medium;
}

.entry-category-container {
  height: 50%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  padding: 5px;
  gap: 5px;

  border-width: 2px;
  border-style: solid;
  border-radius: 15px;
}

.entry-category-symptoms {
  border-color: var(--salmon-transparent);
}

.entry-category-medications {
  border-color: var(--dark-blue-transparent);
}

.entry-notes-container {
  height: 10%;
  border-color: black;
  padding: 5px 10px;
}

.entry-notes {
  overflow: hidden;
}

.entry-right-icons {
  flex: 1 0 0%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.entry-icons-top {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;
}

.entry-icons-bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;
}

</style>