<template>
  <div id="app" class="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
      this.$store.commit('setDisplayName', user ? user.displayName : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  --light-blue: rgb(115, 200, 230);
  --light-blue-transparent: rgba(115,200,230,0.6);
  --dark-blue: rgba(45,90,130,1);
  --dark-blue-transparent: rgba(45,90,130,0.75);
  --dark-blue-drop-shadow: rgba(45, 90, 130, 0.4);
  --salmon: rgba(250,125,125,1);
  --salmon-transparent: rgba(250,125,125,0.75);
}

.app {
  font-family: sans-serif;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

header {
  margin: 1em 0;
}

header, header > * {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

header > h2 {
  margin: 0.5em 0;
}

header > h5 {
  margin: 0;
}

button {
  background-color: var(--light-blue);
  border: 0;
  color: white;
}

button:hover:enabled {
  filter: brightness(80%);
}

button:active:enabled {
  filter: brightness(120%);
}

button:disabled, button[disabled] {
  background-color: #cccccc;
}

.form-button {
  border-radius: 8px;
  padding: 8px;
}

.text-button {
  border-radius: 15px;
  padding: 15px;

  display: inline;
  white-space: nowrap;

  font-size: larger;
}

.icon-button {
  cursor: pointer;
}

.icon-button:hover {
  transform: scale(1.1, 1.1);
}

.icon-s {
  font-size: small;
}

.icon-m {
  font-size: medium;
}

.icon-l {
  font-size: large;
}

.icon-ler {
  font-size: larger;
}

.icon-xl {
  font-size: x-large;
}

.icon-xxl {
  font-size: xx-large;
}

.alerts {
  position: absolute;
  z-index: 99;
  top: 100%;
  left: 50%;
  width: fit-content;
  block-size: fit-content;
  max-width: 100%;
  transform: translate(-50%, 10%);
  text-align: center;
}

.alerts article {
  border-radius: 10px;
  padding: 10px 20px;
  margin: 5px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: var(--salmon);
}

.alerts .success {
  background-color: var(--dark-blue);
}

.required-asterisk {
  color: rgba(255,0, 0, 1);
  font-weight: bold;
}
</style>
