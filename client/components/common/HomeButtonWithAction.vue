<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-house"
    @click="home"
  />
</template>

<script>
export default {
  name: 'HomeButton',
  methods: {
    home() {
      this.$router.push({name: 'Home'});
    },
  },
};
</script>
