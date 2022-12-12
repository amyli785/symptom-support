<template>
    <main>
        <b-modal 
            id="share-modal"
            title="Share Entries"
            :hide-footer=true
            size="xl"
            @shown="handleShown"
            @hide="handleHidden"
        >
            <section v-if="!shareCreated" class="share-modal-content">
                <section class="share-modal-name-input">
                    <div>Enter a title for this share:&nbsp;</div>
                    <input
                        :value=name
                        @input="name = $event.target.value"
                        placeholder="Share Title"
                    />
                </section>
                <h4>Sharing Entries:</h4>
                <div class="share-modal-entries">
                    <EntryComponent class="share-modal-entry"
                        v-for="entry in entries"
                        :key="entry._id"
                        :entry="entry"
                        :displayMode="true"
                        :clickable="false"
                    />
                </div>
                <button class="form-button" :disabled="(name.length == 0)" @click="createShare">
                    Create Share
                </button>
            </section>
            <section v-else class="share-modal-content">
                <div>
                    Use this link to share the entries you selected. The link will expire in 72 hours.
                </div>
                <a :href="shareLink" target="_blank">{{this.shareLink}}</a>
            </section>
        </b-modal>
    </main>
</template>

<script>
import EntryComponent from '@/components/Entry/EntryComponent.vue'

export default {
    name: 'ShareModal',
    components: {
        EntryComponent
    },
    props: {
        shareEntries: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            name: "",
            entries: [],
            shareCreated: false,
            shareLink: undefined
        }
    },
    methods: {
        handleHidden(){
            this.entries = [];
            this.$emit("cancel-share");
        },
        handleShown(){
            for (const entry in this.shareEntries) {
                this.entries.push(this.shareEntries[entry]);
            }
        },
        async createShare(){
            const entryIds = this.entries.map(entry => entry._id);
            const options = {
                method: 'POST', body: JSON.stringify({entryIds: entryIds, name: this.name}), headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(`/api/shares/`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                const shareId = res.share._id;
                this.shareCreated = true;
                this.shareLink = `https://symptom-support.vercel.app/#/share/${shareId}`;
            } catch (e) {
                this.$store.commit('alert', {
                    message: e, status: 'error'
                });
            }
        },
    }
}
</script>

<style scoped>
#share-modal {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    gap: 10px;
}

.share-modal-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    gap: 10px;
}

.share-modal-entries {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 40px;
}

.share-modal-name-input{
    display: flex;
    flex-direction: row;
}

.share-modal-entry:hover {
    cursor: auto;
    filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
}
</style>