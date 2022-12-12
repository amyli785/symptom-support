<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-trash"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'DeleteButton',
}
</script>