<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form class="medication-component">
      <header>
        <h5>Medication Component</h5>
        <font-awesome-icon 
          icon="fa-solid fa-x"
          v-if = "!this.viewing"
          @click="$emit('click')"
        />
      </header>
      <article>
        <div>
            <div>
                <label>{{ this.name.label }}:</label>
                <input
                  v-if="this.viewing"
                  disabled
                  class = 'medication-name'
                  :type="'text'"
                  :name="this.name.id"
                  :value="this.medication.name"
                  @input="$emit('update-medication-name', $event.target.value)"
                >
                <input
                  v-else
                  class = 'medication-name'
                  :type="'text'"
                  :name="this.name.id"
                  :value="this.medication.name"
                  @input="$emit('update-medication-name', $event.target.value)"
                >
            </div>
            <div>
                <label>{{ this.dosage.label }}:</label>
                <input
                  v-if="this.viewing"
                  disabled
                  class = 'medication-dosage'
                  :type="'text'"
                  :name="this.dosage.id"
                  :value="this.medication.dosage"
                  @input="$emit('update-medication-dosage', $event.target.value)"
                >
                <input
                  v-else
                  class = 'medication-dosage'
                  :type="'text'"
                  :name="this.dosage.id"
                  :value="this.medication.dosage"
                  @input="$emit('update-medication-dosage', $event.target.value)"
                >
            </div>
        </div>
      </article>
    </form>
  </template>
  
<script>

import DeleteButton from '../common/DeleteButton'

export default {
  name: 'MedicationComponent',
  components: {
    DeleteButton,
  },
  props:{
      medication: {
          type: Object,
          required: true
      },
      viewing: {
        type: Boolean,
        required: true
      }
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      name: {id: 'name', label: 'Name', value: ''},
      dosage: {id: 'dosage', label: 'Dosage', value: ''},
    };
  }
};
</script>  

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h5,
form > * {
  margin: 0.3em 0;
}

input {
  width:100%;
}

form h5 {
  margin-top: 0;
}

header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

.medication-component{
    width:30%;
    border-radius:15px;
}
</style>
