<template>
	<article class="symptom-container">
    <div v-if = "!description" class="symptom-background normal">&nbsp;</div>
    <div v-else class="symptom-background description">&nbsp;</div>
    <div v-if = "!description" class="symptom-content normal">
      <p class="symptom-content-item">
        {{ getContent() }}
      </p>
    </div>
    <div v-else class="symptom-content description">
      <p class="symptom-content-item d">
        name (measurement unit) - location
      </p>
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
    location: {
      Type: String,
      required: true,
    },
    measurement: {
      Type: Number,
      required: true,
    },
    unit: {
      Type: String,
      required: true,
    },
    description: {
      Type: Boolean,
      require: false,
    }
  },
  methods: {
    getContent() {
      if (!this.name) {
        return " - ";
      }
      let contentStart = `${this.name}`;
      if (this.measurement){
        contentStart = contentStart + ` (${this.measurement}`;
        if (this.unit !== 'pain level'){
          contentStart = contentStart + ` ${this.unit})`;
        }
        else {
          contentStart = contentStart + `)`;
        }
      }

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

  background-color: var(--salmon-transparent);

  border-radius: 8px;
}

.symptom-content {
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

.symptom-content-item {
  overflow: hidden;
  white-space: nowrap;
}
.normal{
  padding: 8px;
}
.description{
  padding: 0 8px 0 8px;
}
.d{
  font-style: italic;
}
</style>