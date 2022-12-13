<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <router-link to="/">
        <font-awesome-icon icon="fa-solid fa-heart-pulse" /> Symptom Support
      </router-link>
    </div>
    <div class="right">
      <router-link 
        v-if="$store.state.username"
        to="/flagged"
      >
        Flagged
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/trends"
      >
        Trends
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
        to="/supporting"
      >
        Supporting
      </router-link>
      <!-- <router-link 
        v-if="$store.state.username"
        to="/supportingRequest"
      >
        Supporting Requests
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
    position: sticky;
    top: 0;
    z-index: 99;
    width: 100%;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
  font-size: 20px;
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
