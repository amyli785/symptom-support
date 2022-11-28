<!-- Default page that also displays entries -->

<template>
  <main>
    <section v-if="$store.state.displayName">
      <header>
        <h2>Welcome {{ $store.state.displayName }}</h2>
      </header>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Symptom Support!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete entries.
        </h3>
      </article>
    </section>
    <article @click="testDelete">
      click this to test
    </article>
  </main>
</template>

<script>

export default {
  name: 'EntryPage',
  methods: {
    async testFetch(url, options) {
      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async testGetByUsername() {
      const url = `/api/entries?username=amy2`;
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      this.testFetch(url, options);
    },
    async testGetByEntryId() {
      const url = `/api/entries/63840268ec134f2fe5eb8ea4`;
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      this.testFetch(url, options);
    },
    async testPost() {
      const url = `/api/entries`;
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          owner: 'amy2',
          dateStarted: '2011-01-10T14:48:00.000+09:00',
          symptoms: [
            {
              name: 'headache',
              intensity: 3,
              location: 'head',
            },
          ],
          medications: [
            {
              name: 'advil',
              dosage: 231.2,
            },
          ],
          mood: 4,
        }),
      };
      this.testFetch(url, options);
    },
    async testPatch() {
      const url = `/api/entries/63840268ec134f2fe5eb8ea4`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          dateStarted: '2011-01-10T14:48:00.000+09:00',
          symptoms: [
            {
              name: 'different',
              intensity: 3,
              location: 'head',
            },
          ],
          medications: [
            {
              name: 'other',
              dosage: 231.2,
            },
          ],
          mood: 10,
        }),
      };
      this.testFetch(url, options);
    },
    async testDelete() {
      const url = `/api/entries/63840268ec134f2fe5eb8ea4`;
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      this.testFetch(url, options);
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
