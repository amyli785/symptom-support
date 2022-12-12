<template>
	<article class="medication-container">
    <div v-if = "!description" class="medication-background medication-normal">&nbsp;</div>
    <div v-else class="no-background medication-description">&nbsp;</div>
    <div v-if = "(!description)" class="medication-content medication-normal">
      <div class="medication-content-item">
        {{ getContent() }}
      </div>
    </div>
    <div v-else-if = "extra" class="medication-content medication-description">
      <i class="medication-content-item">
        ...
      </i>
    </div>
    <div v-else-if = "description" class="medication-content medication-description">
      <i class="medication-content-item">
        Medications: name (dosage)
      </i>
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
    },
    extra: {
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

  background-color: var(--dark-blue-transparent);
  border-radius: 10px;
}

.no-background {
  flex: 1 0 100%;

  background-color: white;
  border-radius: 10px;
}

.medication-normal{
  padding: 10px;
}

.medication-description{
  padding: 0 10px;
}

.medication-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  width: 100%;

  opacity: 1;
  border-radius: 10px;

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