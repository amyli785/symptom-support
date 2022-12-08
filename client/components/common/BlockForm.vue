<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <p 
          v-if="(currentLabel)"
        >
          {{currentLabel}}: {{currentValue}}
        </p>
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button v-if="validationFunction && fields"
      :disabled="!validationFunction(fields)"
      type="submit"
    >
      {{ title }}
    </button>
    <button v-else
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
  name: 'BlockForm',
  props: {
    currentLabel: {
      Type: String,
      required: false
    },
    currentValue: {
      Type: String,
      required: false
    },
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUserDetails: false, // Whether or not the stored display name and username should be updated after form submission
      setDisplayName: false, // Whether or not the stored display name should be updated after form submission
      setUsername: false, // Whether or not the stored username should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      validationFunction: null, // Function to validate form input
      refreshSupported: false,
      refreshSupporter: false,
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

        if (this.setUserDetails) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setDisplayName', res.user ? res.user.displayName : null);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.setDisplayName) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setDisplayName', res.user ? res.user.displayName : null);
        }

        if (this.refreshSupported) {
          this.$store.commit('refreshSupported');
        }

        if (this.refreshSupporter) {
          this.$store.commit('refreshSupporter');
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
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
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
</style>
