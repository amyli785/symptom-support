<template>
    <main>
        <header>
            <h2><font-awesome-icon @click="back" class="icon-button" icon="fa-solid fa-arrow-left" />&nbsp;{{ownerDisplay}}'s Entries</h2>
            <h2><HomeButton /></h2>
        </header>
        <button class = "text-button createEntry" 
            v-if="(permission == 'creator' || permission == 'manager')"
            @click = 'createEntry'>
            Create Entry
            &nbsp;
            <font-awesome-icon icon="fa-solid fa-plus" />
        </button>

        <div class="entries"
            v-if="entries.length"
        >
            <EntryComponent
                v-for="entry in entries"
                :key="entry._id"
                :entry="entry"
                :permission="permission"
                :clickable="true"
                @flagToggled="refreshEntries"
                @deleted="refreshEntries"
            />
        </div>
        <div v-else>
            <h3>{{ownerDisplay}} has no entries.</h3>
        </div>
    </main>
</template>

<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';
import EntryComponent from '@/components/Entry/EntryComponent.vue';

export default {
    name: "SupportingEntriesFeed",
    components: {
        HomeButton, EntryComponent,
    },
    async mounted() {
        try {
            if (this.$store.state.username === this.$route.query.username){
                this.valid = true;
                this.permission = 'manager';
                this.owner = this.$route.query.username;
                this.ownerDisplay = this.$store.state.displayName;
            }
            else {
                await this.$store.commit('refreshSupporting');
                for (const support of this.$store.state.supporting){
                    if (support.supporting === this.$route.query.username){
                        this.valid = true;
                        this.permission = support.permission;
                        this.owner = this.$route.query.username;
                        this.ownerDisplay = support.supportingDisplay;
                    }
                }
            }

            if(!this.valid){
                this.$router.push({name: 'Not Found'});
            }
            else{
                await this.refreshEntries();
            }
        } catch (e) {
            this.$router.push({name: 'Not Found'});
        }
    },
    data() {
        return {
            entries: [],
            valid: false,
            permission: '',
            owner: '',
            ownerDisplay: '',
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        createEntry() {
            this.$store.commit('goToEntry', {entry: null, owner: this.owner, status: 'creating', viewOnly: false});
            this.$router.push({name: 'Entry'});
        },
        async refreshEntries() {
            const url = `/api/entries?username=${this.$route.query.username}`;
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.entries = res;
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
.createEntry{
  width: 100%;
  padding: 10px;
  margin-bottom: 25px;
}
</style>