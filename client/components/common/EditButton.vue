<template>
	<div class="edit-button-container icon-button" @click="$emit('click')">
    <font-awesome-icon
      icon="fa-solid fa-pen"
    />
  </div>
</template>

<script>
export default {
  name: 'EditButton',
}
</script>

<style scoped>

.edit-button-container {
  display: flex;

  flex-direction: column;
  justify-self: center;
  align-items: center;
}

</style>