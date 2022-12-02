<template>
    <main>
        <b-modal :hide-footer=true size="xl" id="share-modal" title="Share Entries" @shown="handleShown" @hide="handleHidden">
            <section v-if="!shareCreated" class="nameInput">
                <p>Enter a name for this share: </p>
                <input 
                placeholder="Share Name"
                :value=name
                @input="name = $event.target.value"
                />
            </section>
            <section v-else>
                <p>Use this link to share the entries you selected. Note that the link will expire in 72 hours. </p>
                <a :href="shareLink">{{this.shareLink}}</a>
            </section>
            <section v-if="!shareCreated">
                <p>Entries Selected: </p>
                <div class="entries">
                    <EntryComponent
                        v-for="entry in entries"
                        :key="entry._id"
                        :entry="entry"
                        :displayMode="true"
                        :clickable="false"
                    />
                </div>

            </section>

            <button v-if="!shareCreated" @click="createShare">
                Create Share
            </button>

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
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    }
}
</script>

<style scoped>
.entries {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 40px;
}
</style>