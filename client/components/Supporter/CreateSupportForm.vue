<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article v-if="textFields.length">
      <div
        v-for="field in textFields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>
        <input
          type="text"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
      <div
        v-for="field in dropdownFields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}</label>
        <select
          :name="field.id"
          :id="field.id"
          @input="field.value = $event.target.value"
        >
          <option
            v-for="option in field.options"
            :name="field.id"
            :value="option.value"
          >{{option.display}}</option>
        </select>
      </div>
    </article>
    <button :disabled="textFields[0].value === '' || dropdownFields[0].value === ''"
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'CreateSupportForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '/api/supports', // Url to submit form to
      method: 'POST', // Form request method
      hasBody: true, // Whether or not form request has a body
      textFields:[
        {id: 'username', label: 'Username', value: ''},
      ],
      dropdownFields:[
        {id: 'permission', label: 'Permission', value: '', options: [
          {value: '', display: ''},
          {value: 'viewer', display: 'viewer - view your existing entries'},
          {value: 'creator', display: 'creator - create entries on your behalf and view your existing entries'},
          {value: 'manager', display: 'manager - create, edit, delete, and flag your entries'},
        ]},
      ],
      title: 'Add supporter',
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
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
      // if (this.hasBody) {
      options.body = JSON.stringify(Object.fromEntries(
          this.textFields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
          }).concat(this.dropdownFields.map(field => {
              const {id,value} = field;
              field.value = ''
              return[id,value]
          }))
      ));
      // }

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
        location.reload()
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
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

button{
  padding: 5px;
  border-radius: 10px;
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

input{
  border-radius: 10px;
  border: 1px solid rgb(120, 120, 120);
}

select{
  border-radius:10px;
  padding: 5px 0px 5px 0px;
}
</style>