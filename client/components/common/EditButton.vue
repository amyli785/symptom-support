<template>
  <font-awesome-icon
    class="icon-button"
    icon="fa-solid fa-pen"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'EditButton',
}
</script>
