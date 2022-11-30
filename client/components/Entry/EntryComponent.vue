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
        :key="symptom.name"
        :name="symptom.name"
        :intensity="symptom.intensity"
        :location="symptom.location"
      />
      <SymptomComponent
        v-for="i in Math.max(0, 3 - entry.symptoms.length)"
        :key="i"
        :name="''"
        :intensity="''"
        :location="''"
      />
      
      <div v-for="med in entry.medications.slice(0,3)">
        <p class = "med details-container">
          {{med.name}} ({{med.dosage}})
        </p>
      </div>
      <div v-if = "entry.medications.length < 3">
        <div v-for="i in 3 - entry.medications.length">
          <p class = "med details-container">
            -
          </p>
        </div>
      </div>
    </div>

    <div class = "right-icons">
      <div class = "top">
        <FlagButton :flagged="flagged" @click="toggleFlag" />
      </div>
      
      <div class = "bottom">
        <EditButton @click="editEntry" />
        <DeleteButton @click="deleteEntry" />
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment';
import SymptomComponent from './SymptomComponent';
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

  gap: 6px;
}
.left-content {
  flex: 0 1 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  gap: 6px;
}
.right-icons {
  flex: 0 0 10%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
.entry-dates-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  font-weight: bold;
  font-size: medium;
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