<template>
  <form class="symptom-component">
    <header class="symptom-component-header">
      <h5>Symptom Component</h5>
      <XButton
        v-if="!this.viewing"
        class="icon-m"
        @click="$emit('click')"
      />
    </header>
    <article>
      <div>
        <label>{{ this.name.label }} <span v-if="!this.viewing" class="required-asterisk">*</span></label>
        <textarea
          class="symptom-component-field"
          :disabled="this.viewing"
          :type="'text'"
          :name="this.name.id"
          :value="this.symptom.name"
          @input="$emit('update-symptom-name', $event.target.value)"
        ></textarea>
      </div>
      <div>
        <label>{{ this.location.label }}</label>
        <textarea
          class="symptom-component-field"
          :disabled="this.viewing"
          :type="'text'"
          :name="this.location.id"
          :value="this.symptom.location"
          @input="$emit('update-symptom-location', $event.target.value)"
        ></textarea>
      </div>
      <div>
        <div>
          <label :for="measurement.id">{{ measurement.label }} </label>
          <input
            class="symptom-component-field"
            :disabled="this.viewing"
            :type="'text'"
            :name="this.measurement.id"
            :value="this.symptom.measurement"
            @input="$emit('update-symptom-measurement', $event.target.value)"
          >
        </div>
        <div>
            <label :for="unit.id">{{ unit.label }} </label>
            <select
              class="symptom-component-field"
              :disabled="this.viewing"
              :name="this.unit.id"
              :id="unit.id"
              :value="this.symptom.unit"
              @input="$emit('update-symptom-unit', $event.target.value)"
            >
              <option
                v-for="unit in ['','out of 1 - 10','mL', 'kg', '°F', '°C', 'pound']"
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
import DeleteButton from '../common/DeleteButton';

export default {
  name: 'SymptomComponent',
  components: {
    XButton, DeleteButton,
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
      name: {id: 'name', label: 'Symptom Name', value: ''},
      location: {id: 'location', label: 'Affected Area', value: ''},
      measurement: {id: 'measurement', label: 'Measurement', value: ''},
      unit: {id: 'unit', label: 'Unit', value: ''},
    };
  }
};
</script>  

<style scoped>

label{
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

.symptom-component {
  flex-basis: calc((100% - 40px)/3);
  background-color: var(--salmon-transparent);

  border: none;
  padding: 15px;
  border-radius: 15px;
  gap: 5px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.symptom-component-header {
  margin: 0;
}

.symptom-component-field {
  width: 100%;
  border: 0px;
  border-radius: 5px;
  height: 30px;
}

</style>
