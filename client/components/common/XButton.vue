<template>
	<div class="x-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
    class = "i"
      icon="fa-solid fa-x"
    />
  </div>
</template>

<script>
export default {
  name: 'XButton',
}
</script>

<style scoped>

.x-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}
.i{
  font-size: 26px;
}
</style>