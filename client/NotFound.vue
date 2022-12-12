<!-- Catch-all page for visiting invalid URLs that haven't been registered -->

<template>
  <main>
    <section>
      <header>
        <h2>Page Not Found</h2>
        <h2><HomeButton /></h2>
      </header>
      <p>The page that you requested could not be found.</p>
      <h3>
        <router-link to="/">
          Return to the home page
        </router-link>
      </h3>
    </section>
  </main>
</template>

<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';

export default {
  name: 'NotFound',
  components: {HomeButton},
};
</script>