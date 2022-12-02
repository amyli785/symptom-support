<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form class="symptom-component">
      <header>
        <h5>Symptom Component</h5>
        <font-awesome-icon 
          icon="fa-solid fa-x"
          v-if = "!this.viewing"
          @click="$emit('click')"
        />
      </header>
      <article>
        <div>
            <label>{{ this.name.label }}:</label>
            <input
              v-if="this.viewing"
              disabled
              :type="'text'"
              :name="this.name.id"
              :value="this.symptom.name"
              @input="$emit('update-symptom-name', $event.target.value)"
            >
            <input
              v-else
              :type="'text'"
              :name="this.name.id"
              :value="this.symptom.name"
              @input="$emit('update-symptom-name', $event.target.value)"
            >
        </div>
        <div>
            <label>{{ this.location.label }}:</label>
            <input
              v-if="this.viewing"
              disabled
              :type="'text'"
              :name="this.location.id"
              :value="this.symptom.location"
              @input="$emit('update-symptom-location', $event.target.value)"
            >
            <input
              v-else
              :type="'text'"
              :name="this.location.id"
              :value="this.symptom.location"
              @input="$emit('update-symptom-location', $event.target.value)"
            >
        </div>
        <div class="measurement-container">
            <div class = 'measurement-value'>
                <label :for="measurement.id">{{ measurement.label }}: </label>
                <input
                    v-if="this.viewing"
                    disabled
                    :type="'text'"
                    :name="this.measurement.id"
                    :value="this.symptom.measurement"
                    @input="$emit('update-symptom-measurement', $event.target.value)"
                >
                <input
                    v-else
                    :type="'text'"
                    :name="this.measurement.id"
                    :value="this.symptom.measurement"
                    @input="$emit('update-symptom-measurement', $event.target.value)"
                >
            </div>
            <div class = 'measurement-unit'>
                <label :for="unit.id">{{ unit.label }}: </label>
                <select
                    v-if="this.viewing"
                    disabled
                    :name="this.unit.id"
                    :id="unit.id"
                    :value="this.symptom.unit"
                    @input="$emit('update-symptom-unit', $event.target.value)"
                >
                    <option
                        v-for="unit in ['','pain level','mL', 'kg', 'deg F', 'deg C']"
                        :name="unit.id"
                    >{{unit}}</option>
                </select>
                <select
                    v-else
                    :name="this.unit.id"
                    :id="unit.id"
                    :value="this.symptom.unit"
                    @input="$emit('update-symptom-unit', $event.target.value)"
                >
                    <option
                        v-for="unit in ['','pain level','mL', 'kg', 'deg F', 'deg C']"
                        :name="unit.id"
                    >{{unit}}</option>
                </select>
            </div>
        </div>
        <DeleteButton 
          v-if = "!this.viewing"
          @click="$emit('click')"
        />
    </article>
</form>
</template>
  
<script>
import DeleteButton from '../common/DeleteButton'
export default {
  name: 'SymptomComponent',
  components: {
    DeleteButton,
  },
  props:{
      symptom: {
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
      location: {id: 'location', label: 'Location', value: ''},
      measurement: {id: 'measurement', label: 'Measurement', value: ''},
      unit: {id: 'unit', label: 'Unit', value: ''},
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
input {
  width:100%;
}
select {
  width:100%;
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
.measurement-container{
    display: flex;
    flex-direction: column;
    justify-content:flex-start;
    gap: 12px;
}
.symptom-component{
    width:30%;
    border-radius: 15px;
}
</style>
