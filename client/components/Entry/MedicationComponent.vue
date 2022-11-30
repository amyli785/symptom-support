<template>
	<article class="medication-container">
    <div class="medication-background">&nbsp;</div>
    <div class="medication-content">
      <div class="medication-content-item">
        {{ getContent() }}
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'MedicationComponent',
  props: {
    name: {
      Type: String,
      required: true,
    },
    dosage: {
      Type: Number,
      required: true,
    },
  },
  methods: {
    getContent() {
      if (!this.name) {
        return "none";
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
  opacity: 0.4;

  border-radius: 8px;
  padding: 8px;
}

.medication-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  width: 100%;

  opacity: 1;

  border-radius: 8px;
  padding: 8px;

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

</style>