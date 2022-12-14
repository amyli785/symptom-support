<template>
	<article class="medication-container">
    <div v-if="description" class="no-background medication-description">&nbsp;</div>
    <div v-else-if="blank" class="no-background medication-normal">&nbsp;</div>
    <div v-else class="medication-background medication-normal">&nbsp;</div>
    <div v-if="description && extra" class="medication-content medication-description">
      <i v-if="blank" class="medication-content-item">
        &nbsp;
      </i>
      <i v-else class="medication-content-item">
        ...
      </i>
    </div>
    <div v-else-if="description" class="medication-content medication-description">
      <i class="medication-content-item">
        Medications: name (dosage)
      </i>
    </div>
    <div v-else class="medication-content medication-normal">
      <div v-if="blank" class="medication-content-item">
        &nbsp;
      </div>
      <div v-else class="medication-content-item">
        {{ getContent() }}
      </div>
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
    unit: {
      Type: String,
      required: true,
    },
    description: {
      Type: Boolean,
      required: false,
      default: false,
    },
    extra: {
      Type: Boolean, 
      required: false,
      default: false,
    },
    blank: {
      Type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    getContent() {
      const content = `${this.name} (${this.dosage} ${this.unit})`;
      return content;
    },
  },
};
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