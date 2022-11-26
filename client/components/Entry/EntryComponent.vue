<!-- Reusable component representing a single freet and its actfreet.authorions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="entry" @click = "goToView">
    <div class = "info-side">
      <p class = "date">
        {{ entry.dateStart }}
        <i v-if = "entry.dateEnd != undefined"> - {{entry.dateEnd}}</i>
      </p>
      <div v-for="sym in entry.symptoms.slice(0,3)">
        <p class = "sym box">
          {{sym.name}} ({{sym.level}}) - {{sym.location}}
        </p>
      </div>
      <div v-for="med in entry.medications.slice(0,3)">
        <p class = "med box">
          {{med.name}} ({{med.dosage}})
        </p>
      </div>
    </div>
    <div class = "icons-side">
      <div class = "top">
        <div
            v-if="flagged" 
            @click="unflag"
            class = "icon"
        >
          <img scr = "" class = "black-flag">
        </div>
        <div
            v-else 
            @click="flag"
            class = "icon"
        >
          <img scr = "" class = "white-flag">
        </div>
      </div>
      
      <div class = "bottom">
        <img scr = "" @click = "goToEdit" class = "pencil icon">
        <img scr = "" @click = "deleteEntry" class = "trash icon">
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
  async mounted() {
    //find if entry is flagged
  },
  methods: {
    deleteEntry() {

    },
    goToEdit() {
      
    },
    goToView() {

    },
    unflag(){

    },
    flag(){

    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
    },
  }
};
</script>

<style scoped>
.entry {
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  margin: 0.5%;
  padding: 2.5%;
  position: relative;
  width: 47.5%;
  display: flex;
  flex-direction: row;
}

.info-side {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.icons-side {
  width: 20%;
  height: 100%;
}

.top {
  position: absolute;
  top:0;
}
.bottom {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.icon {
  width: 40px;
}