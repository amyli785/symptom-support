<template>
	<article class="symptom-container">
    <div class="symptom-background">&nbsp;</div>
    <div class="symptom-content">
      <div class="symptom-content-item">
        {{ getContent() }}
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'SymptomSingleLine',
  props: {
    name: {
      Type: String,
      required: true,
    },
    intensity: {
      Type: Number,
      required: true,
    },
    location: {
      Type: String,
      required: true,
    },
  },
  methods: {
    getContent() {
      if (!this.name) {
        return "none";
      }

      const contentStart = `${this.name} (${this.intensity})`;

      if (!this.location) {
        return contentStart;
      }

      return contentStart +  ` - ${this.location}`;
    },
  },
}
</script>

<style scoped>

.symptom-container {
  position: relative;

  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}

.symptom-background {
  flex: 1 0 100%;

  background-color: var(--light-blue);
  opacity: 0.6;

  border-radius: 8px;
  padding: 8px;
}

.symptom-content {
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

.symptom-content-item {
  overflow: hidden;
  white-space: nowrap;
}

</style>