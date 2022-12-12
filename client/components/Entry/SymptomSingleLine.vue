<template>
	<article class="symptom-container">
    <div v-if="!description" class="symptom-background symptom-normal">&nbsp;</div>
    <div v-else class="no-background symptom-description">&nbsp;</div>
    <div v-if="!description" class="symptom-content symptom-normal">
      <div class="symptom-content-item">
        {{ getContent() }}
      </div>
    </div>
    <div v-else-if="extra" class="symptom-content symptom-description">
      <i class="symptom-content-item">
        ...
      </i>
    </div>
    <div v-else="description" class="symptom-content symptom-description">
      <i class="symptom-content-item">
        Symptom: name (measurement unit) - location
      </i>
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
  border-radius: 10px;
}

.no-background {
  flex: 1 0 100%;

  background-color: white;
  border-radius: 10px;
}

.symptom-normal {
  padding: 10px;
} 

.symptom-description {
  padding: 0 10px;
}

.symptom-content {
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

.symptom-content-item {
  overflow: hidden;
  white-space: nowrap;
}
</style>