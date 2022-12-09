<template>
	<div class="flag-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
      class = "i"
      v-if="flagged"
      icon="fa-solid fa-flag"
    />
    <font-awesome-icon
      class = "i"
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
.i{
  font-size: 30px;
}
</style>