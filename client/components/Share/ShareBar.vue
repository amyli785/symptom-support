<template>
    <main>
        <section class="share-bar">
            <button class="form-button" @click="doneSelecting" :disabled="(shareSize==0)">Done</button>

            <section class="share-bar-text">
                <p>Click to select the entries you want to share: </p>
                <p class="shareCount">{{shareSize}} selected</p>
            </section>
            <button class="form-button share-bar-right" @click="cancelShare">Cancel</button>
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

.share-bar{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 8px 2%;
  background-color: var(--dark-blue);
  text-align: center;
}

button {
    background-color: white;
    color: var(--dark-blue);
    padding: 0px 20px;
}

button:disabled {
    background-color:rgba(200,200,200,1);
}

p {
    margin: 0;
    padding: 10px;
}

.share-bar-text{
    font-weight: bold;
    display: flex;
    flex-direction: row;
    color: white;
}

</style>