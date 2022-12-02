<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form class="medication-component"
        @submit.prevent="submit">
      <h3>Medication Component</h3>
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
        <DeleteButton 
          v-if="this.viewing"
          disabled
        />
        <DeleteButton 
          v-else
          @click="$emit('click')"
        />
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
        url: '', // Url to submit form to
        method: 'GET', // Form request method
        hasBody: false, // Whether or not form request has a body
        alerts: {}, // Displays success/error messages encountered during form submission
        callback: null, // Function to run after successful form submission
        validationFunction: null, // Function to validate form input
        name: {id: 'name', label: 'Name', value: ''},
        dosage: {id: 'dosage', label: 'Dosage', value: ''},
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

.medication-component{
    width:30%;
    border-radius:15px;
}
</style>
