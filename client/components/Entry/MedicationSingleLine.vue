<template>
	<article class="medication-container">
    <div v-if = "!description" class="medication-background normal">&nbsp;</div>
    <div v-else class="medication-background description">&nbsp;</div>
    <div v-if = "!description" class="medication-content normal">
      <div class="medication-content-item">
        {{ getContent() }}
      </div>
    </div>
    <div v-else class="medication-content description">
      <p class="medication-content-item">
        name (dosage)
      </p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'MedicationSingleLine',
  props: {
    name: {
      Type: String,
      required: true,
    },
    dosage: {
      Type: Number,
      required: true,
    },
    description: {
      Type: Boolean,
      required: false,
    }
  },
  methods: {
    getContent() {
      if (!this.name) {
        return " - ";
      }
      const content = `${this.name} (${this.dosage} mg)`;
      return content;
    },
  },
}
</script>

<style scoped>
.medication-container {
  position: relative;

  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}
.medication-background {
  flex: 1 0 100%;

  background-color: var(--dark-blue);
  opacity: 0.6;

  border-radius: 8px;
}
.medication-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  width: 100%;

  opacity: 1;

  border-radius: 8px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  
  overflow: hidden;
  white-space: nowrap;
}
.medication-content-item {
  overflow: hidden;
  white-space: nowrap;
}
.normal{
  padding: 8px;
}
.description{
  padding: 0 8px 0 8px;
}
</style>