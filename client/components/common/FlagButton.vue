<template>
	<div class="flag-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
      v-if="flagged"
      icon="fa-solid fa-flag"
    />
    <font-awesome-icon
      v-else
      icon="fa-regular fa-flag"
    />
  </div>
</template>

<script>
export default {
  name: 'FlagButton',
  props: {
    flagged: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style scoped>

.flag-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}

</style>