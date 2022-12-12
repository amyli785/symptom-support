<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-check"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'AcceptButton',
}
</script>
