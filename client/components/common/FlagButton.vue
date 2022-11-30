<template>
	<div class="flag-button-container" @click="$emit('click')">
    <div v-if="flagged">
      flagged
    </div>
    <div v-else>
      unflagged
    </div>
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

.flag-button-contained {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}

</style>