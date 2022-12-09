<template>
	<div class="accept-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
      class = "i"
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

.accept-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}
.i{
  font-size: 30px;
}
</style>