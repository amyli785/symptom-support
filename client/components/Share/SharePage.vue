<template>
    <main>
        <h2>
            {{name}}
        </h2>
        <div class="entries">
            <EntryComponent
                v-for="entry in entries"
                :key="entry._id"
                :entry="entry"
                :displayMode="true"
                :clickable="true"
            />
        </div>
    </main>
</template>

<script>
import EntryComponent from '@/components/Entry/EntryComponent.vue'

export default {
    name: "SharePage",
    components: {EntryComponent},
    async beforeCreate() {
        try {
            const r = await fetch(`/api/shares/${this.$route.params.shareId}`);
            if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }

            const share = await r.json();
            this.entries = share.items;
            this.name = share.name;

        } catch {
            this.$router.push({name: 'Not Found'})
        }
    },
    data() {
        return {
            entries: [],
            name: undefined
        }
    }
}
</script>

<style scoped>

h2 {
    margin: 20px 10px;
}
.entries {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 40px;
}

</style>