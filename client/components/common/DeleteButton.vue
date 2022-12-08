<template>
	<div class="delete-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
    class = "i"
      icon="fa-solid fa-trash"
    />
  </div>
</template>

<script>
export default {
  name: 'DeleteButton',
}
</script>

<style scoped>

.delete-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}
.i{
  font-size: 30px;
}
</style>