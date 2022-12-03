<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img class = "logo" src = "../../public/logo1.png">
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/flagged"
      >
        Flagged
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/supporter"
      >
        Supporters
      </router-link>
      <!-- <router-link 
        v-if="$store.state.username"
        to="/supporterRequest"
      >
        Supporter Requests
      </router-link> -->
      <router-link 
        v-if="$store.state.username"
        to="/supported"
      >
        Supporting
      </router-link>
      <!-- <router-link 
        v-if="$store.state.username"
        to="/supportedRequest"
      >
        Supported Requests
      </router-link> -->
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: var(--light-blue);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}
.alerts {
    width: 25%;
}
a:link { 
  text-decoration: none; 
}
a:visited { 
  text-decoration: none; 
}
a:hover { 
  text-decoration: none; 
  color:white;
}
a:active { 
  text-decoration: none; 
}
a{
  color:black;
  font-weight: bold;
}

</style>
