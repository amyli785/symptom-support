<template>
    <main>
        <section class="shareBar">
            <section class="shareBar-left">
            <button @click="doneSelecting" :disabled="(shareSize==0)">Done</button>
            <p class="shareCount">{{shareSize}} Selected</p>
            </section>
            <button @click="cancelShare" class="shareBar-right">Cancel</button>
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

.shareBar{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 20px;
  background-color: var(--light-blue);
  text-align: center;
}
.shareBar-left{
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: space-between;
}

p{
    margin: 0;
    padding: 10px;
}

</style>