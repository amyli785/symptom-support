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
          class = 'i'
        />
      </header>
      <article>
        <div>
            <div>
                <label><span v-if="!this.viewing" class="required">*</span>{{ this.name.label }}:</label>
                <textarea
                  v-if="this.viewing"
                  disabled
                  class = 'medication-name'
                  :type="'text'"
                  :name="this.name.id"
                  :value="this.medication.name"
                  @input="$emit('update-medication-name', $event.target.value)"
                ></textarea>
                <textarea
                  v-else
                  class = 'medication-name'
                  :type="'text'"
                  :name="this.name.id"
                  :value="this.medication.name"
                  @input="$emit('update-medication-name', $event.target.value)"
                ></textarea>
            </div>
            <div>
                <label><span v-if="!this.viewing" class="required">*</span>{{ this.dosage.label }}:</label>
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
            <div class = 'dosage-unit'>
                <label :for="this.unit.id"><span v-if="!this.viewing" class="required">*</span>{{ this.unit.label }}: </label>
                <select
                    v-if="this.viewing"
                    disabled
                    :name="this.unit.id"
                    :id="unit.id"
                    :value="this.medication.unit"
                    @input="$emit('update-medication-unit', $event.target.value)"
                >
                    <option
                        v-for="unit in ['','mg', 'ml']"
                        :name="unit.id"
                    >{{unit}}</option>
                </select>
                <select
                    v-else
                    :name="this.unit.id"
                    :id="unit.id"
                    :value="this.medication.unit"
                    @input="$emit('update-medication-unit', $event.target.value)"
                >
                    <option
                        v-for="unit in ['','mg', 'ml']"
                        :name="unit.id"
                    >{{unit}}</option>
                </select>
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
      name: {id: 'name', label: 'Medication Name', value: ''},
      dosage: {id: 'dosage', label: 'Dosage', value: ''},
      unit: {id: 'unit', label: 'Unit', value: ''}
    };
  }
};
</script>  

<style scoped>
form {
  border: 0px solid #000;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--dark-blue-transparent);
}
input {
  width: 100%;
  border: 0px;
  border-radius: 5px;
}
textarea{
  width: 100%;
  border: 0px;
  border-radius: 5px;
  height: 1.75em;
}
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin:0;
  padding: 0;
}
textarea {
   font-family: inherit;
   font-size: inherit;
}

select {
  width:100%;
  border-radius: 5px;
  border: 0px;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  height:1.75em;
}
select:disabled{
  background-color: rgba(255,255,255,0.3);
}
.medication-component{
    width:30%;
    border-radius:15px;
}
.add-button{
  flex: 1 0 0%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.i{
  cursor: pointer;
  font-size: 20px;
}
.i:hover{
  transform: scale(1.1, 1.1);
}
label{
  cursor: text;
}
.required{
  color: rgba(255,0, 0, 1);
}
</style>
