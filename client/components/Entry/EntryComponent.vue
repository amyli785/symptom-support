<!-- Reusable component representing a single freet and its actfreet.authorions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class = "entry" @click = "viewEntry">
    <div class = "info-side">
      <p class = "date">
        {{ entry.dateStarted }}
        <i v-if = "entry.dateEnded"> - {{entry.dateEnded}}</i>
      </p>
      <div v-for="sym in entry.symptoms.slice(0,3)">
        <p class = "sym box">
          {{sym.name}} ({{sym.level}}) - {{sym.location}}
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
        <div class = "button-label" @click="editEntry">
          <div class = "icon edit"></div>
          <div class = "label">Edit</div>
        </div>
        <div class = "button-label" @click="deleteEntry">
          <div class = "icon delete"></div>
          <div class = "label">Delete</div>
        </div>
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
    editEntry() {
      
    },
    viewEntry() {

    },
    unflag(){
      this.flagged = false;
    },
    flag(){
      this.flagged = true;
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
p {
  margin: 0;
  padding: 0;
}
.entry {
  border: 2px solid var(--primary-color);
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
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.icons-side {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top {
  display: flex;
  flex-direction: row-reverse;
}
.bottom {
  position: absolute;
  bottom:0;
  right:2%;
  display: flex;
  flex-direction: row;
}
.date {
  font-weight: bold;
  font-size: medium;
}
.box{
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom:1px;
  border: 1px solid black;
}
.sym{
  background-color: rgba(255,100,255,0.1);
}
.med {
  background-color: rgba(55, 100, 255, 0.1);
}
.inv {
  opacity: 0;
}
.icon{
  height:40px;
  width:40px;
  padding:0;
  margin:0;
  list-style-type: none;
  cursor: pointer;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center
}
.button-label{
  display:flex;
  flex-direction: column;
}
.label{
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.7em;
  width: fit-content + 1em;
  height: 1.2em;
  background-color: var(--primary-color);
  position: relative;
  top: 5px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity .2s ease-in-out 0s;
}
.button-label:hover .label{
  opacity: 1;
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