<template>
	<div class="accept-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
      icon="fa-solid fa-check"
    />
  </div>
</template>

<script>
export default {
  name: 'AcceptButton',
}
</script>

<style scoped>

.delete-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}

</style>