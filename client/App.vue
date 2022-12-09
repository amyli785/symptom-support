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
  --light-blue: rgba(115,200,230,1);
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

header{
  margin: 1.5em 0 1.5em 0;
}

main {
  padding: 0 5em 5em;
}

button {
  background-color: var(--light-blue);
  border: 0;
  border-radius: 10px  !important;
  padding: 5px;
  color: white;
}

button:hover:enabled{
  filter: brightness(80%);
}

button:active:enabled{
  filter: brightness(120%);
}

button:disabled,
button[disabled]{
  background-color: #cccccc;
}

.icon-button {
  cursor: pointer;
}

.icon-button:hover {
  transform: scale(1.1, 1.1);
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}
</style>
