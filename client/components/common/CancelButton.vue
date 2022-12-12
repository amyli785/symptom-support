<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-ban"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'CancelButton',
}
</script>