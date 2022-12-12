<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-x"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'XButton',
}
</script>