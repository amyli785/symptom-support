<template>
    <main>
        <header>
            <h2>{{name}}</h2>
        </header>
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
    data() {
        return {
            entries: [],
            name: undefined,
        };
    },
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
};
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