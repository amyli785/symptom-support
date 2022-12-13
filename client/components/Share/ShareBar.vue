<template>
    <main>
        <section class="share-bar">
            <button class="text-button" @click="doneSelecting" :disabled="(shareSize==0)">Done</button>
            <section class="share-bar-text">
                Click to select the entries you want to share:&emsp;{{shareSize}} selected
            </section>
            <button class="text-button" @click="cancelShare">Cancel</button>
      </section>
    </main>
</template>

<script> 
export default {
    name: "ShareBar",
    props: {
        shareEntries: {
            type: Object,
            required: true
        },
        sharingMode: {
            type: Boolean,
            required: true
        },
        shareSize: {
            type: Number,
            required: true
        }
    }, 
    methods: {
        cancelShare(){
            this.$emit("cancel-share");
        },
        doneSelecting(){
            this.$emit("show-share-modal");
        },
    }
}
</script>

<style scoped>

button {
    background-color: white;
    color: var(--dark-blue);
}

button:disabled {
    background-color:rgba(200,200,200,1);
}

.share-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

  padding: 10px 2%;
  
  background-color: var(--dark-blue);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.share-bar-text{
    font-weight: bold;
    color: white;
}

</style>