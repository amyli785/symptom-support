<template>
  <form class="medication-component">
    <header class="medication-component-header">
      <h5>Medication</h5>
      <XButton
        v-if="!this.viewing"
        class="icon-m"
        @click="$emit('click')"
      />
    </header>
    <article>
      <div>
        <div>
          <label>{{ this.name.label }} <span v-if="!this.viewing" class="required-asterisk">*</span></label>
          <textarea
            class="medication-component-field"
            :disabled="this.viewing"
            :type="'text'"
            :name="this.name.id"
            :value="this.medication.name"
            @input="$emit('update-medication-name', $event.target.value)"
          ></textarea>
        </div>
        <div>
          <label>{{ this.dosage.label }} <span v-if="!this.viewing" class="required-asterisk">*</span></label>
          <input
            class="medication-component-field"
            :disabled="this.viewing"
            :type="'text'"
            :name="this.dosage.id"
            :value="this.medication.dosage"
            @input="$emit('update-medication-dosage', $event.target.value)"
          >
        </div>
        <div>
          <label :for="this.unit.id">{{ this.unit.label }} <span v-if="!this.viewing" class="required-asterisk">*</span></label>
          <select
            class="medication-component-field"
            :disabled="this.viewing"
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
import XButton from '../common/XButton';

export default {
  name: 'MedicationComponent',
  components: {
    XButton,
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

label {
  cursor: text;
}

select {
  background-color: white;
}
select:disabled {
  background-color: rgba(255,255,255,0.5);
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

.medication-component{
  flex-basis: calc((100% - 40px)/3);
  background-color: var(--dark-blue-transparent);

  border: none;
  padding: 15px;
  border-radius: 15px;
  gap: 5px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.medication-component-header {
  margin: 0;
}

.medication-component-field {
  width: 100%;
  border: 0px;
  border-radius: 5px;
  height: 30px;
}

</style>
