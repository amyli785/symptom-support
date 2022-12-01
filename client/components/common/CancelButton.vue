<template>
	<div class="cancel-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
    class = "i"
      icon="fa-solid fa-ban"
    />
  </div>
</template>

<script>
export default {
  name: 'CancelButton',
}
</script>

<style scoped>

.cancel-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}
.i{
  font-size: 25px;
}
</style>