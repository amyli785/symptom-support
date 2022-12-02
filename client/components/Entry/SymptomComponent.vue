<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form class="symptom-component"
          @submit.prevent="submit">
      <h3>Symptom Component</h3>
      <article>
        <div
            v-for="field in fields"
            :key="field.id"
        >
            <label :for="field.id">{{ field.label }}:</label>
            <input
            :type="'text'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
            >
        </div>
        <div class="measurement-container">
            <div class = 'measurement-value'>
                <label :for="measurement.id">{{ measurement.label }}: </label>
                <input
                    :type="'text'"
                    :name="measurement.id"
                    :value="measurement.value"
                    @input="measurement.value = $event.target.value"
                >
            </div>
            <div class = 'measurement-unit'>
                <label :for="unit.id">{{ unit.label }}: </label>
                <select
                    :name="unit.id"
                    :id="unit.id"
                    @input="unit.value = $event.target.value"
                >
                    <option
                        v-for="unit in ['','pain level (1-10)','ml', 'kg', 'deg F', 'deg C']"
                        :name="unit.id"
                    >{{unit}}</option>
                </select>
            </div>
        </div>
    </article>
</form>
</template>
  
  <script>
  
  export default {
    name: 'SymptomComponent',
    data() {
      /**
       * Options for submitting this form.
       */
      return {
        url: '', // Url to submit form to
        method: 'GET', // Form request method
        hasBody: false, // Whether or not form request has a body
        alerts: {}, // Displays success/error messages encountered during form submission
        callback: null, // Function to run after successful form submission
        validationFunction: null, // Function to validate form input
        fields: [
            {id: 'name', label: 'Name', value: ''},
            {id: 'location', label: 'Location', value: ''},
        ],
        measurement: {id: 'measurement', label: 'Measurement', value: ''},
        unit: {id: 'unit', label: 'Unit', value: ''},
      };
    },
    methods: {
      async submit() {
        /**
          * Submits a form with the specified options from data().
          */
        const options = {
          method: this.method,
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        if (this.hasBody) {
          options.body = JSON.stringify(Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          ));
        }
  
        try {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }
  
          if (this.callback) {
            this.callback();
          }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
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

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

.measurement-container{
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    gap: 12px;
}

.symptom-component{
    width:30%;
}
</style>
