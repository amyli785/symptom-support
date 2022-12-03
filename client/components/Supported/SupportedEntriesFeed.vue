<template>
    <main>
        <h2>{{ownerDisplay}}'s Entries </h2>
        <button class = "createEntry" 
            v-if="(permission == 'creator' || permission == 'manager')"
            @click = 'createEntry'>
            Create Entry
        </button>
        <div class="entries">
            <EntryComponent
                v-for="entry in entries"
                :key="entry._id"
                :entry="entry"
                :permission="permission"
                :clickable="true"
            />
        </div>
    </main>
</template>

<script>
import EntryComponent from '@/components/Entry/EntryComponent.vue'

export default {
    name: "SupportedEntriesFeed",
    components: {EntryComponent},
    // async beforeCreate() {
    //     try {
    //         if (this.$store.state.username === this.$route.query.username){
    //             this.valid = true;
    //             this.permission = 'manager';
    //             this.owner = this.$route.query.username;
    //             this.ownerDisplay = this.$store.state.displayName;
    //         }
    //         else {
    //             this.$store.commit('refreshSupported');
    //             for (const support of this.$store.state.supported){
    //                 if(support.supported === this.$route.query.username){
    //                     this.valid = true;
    //                     this.permission = support.permission;
    //                     this.owner = this.$route.query.username;
    //                     this.ownerDisplay = support.supportedDisplay;
    //                 }
    //             }
    //         }

    //         if(!this.valid){
    //             this.$router.push({name: 'Not Found'});
    //         }
    //         else{
    //             const r = await fetch(`/api/entries?username=${this.$route.query.username}`);
    //             if (!r.ok) {
    //                 const res = await r.json();
    //                 throw new Error(res.error);
    //             }

    //             this.entries = await r.json();
    //         }
    //     } catch {
    //         this.$router.push({name: 'Not Found'})
    //     }
    // },
    async mounted(){
        try {
            if (this.$store.state.username === this.$route.query.username){
                this.valid = true;
                this.permission = 'manager';
                this.owner = this.$route.query.username;
                this.ownerDisplay = this.$store.state.displayName;
            }
            else {
                this.$store.commit('refreshSupported');
                for (const support of this.$store.state.supported){
                    if(support.supported === this.$route.query.username){
                        this.valid = true;
                        this.permission = support.permission;
                        this.owner = this.$route.query.username;
                        this.ownerDisplay = support.supportedDisplay;
                    }
                }
            }

            if(!this.valid){
                this.$router.push({name: 'Not Found'});
            }
            else{
                const r = await fetch(`/api/entries?username=${this.$route.query.username}`);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.entries = await r.json();
            }
        } catch {
            this.$router.push({name: 'Not Found'})
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
        createEntry(){
            this.$store.commit('goToEntry', {entry: null, owner: this.owner, status: 'creating', viewOnly: false});
            this.$router.push({name: 'Entry'});
        },
        viewPermission() {
            console.log(this.permission);
            console.log(this.valid)
        }
    }
}
</script>

<style scoped>
.createEntry{
  width: 100%;
  padding: 10px;
  margin-bottom: 25px;
}
</style>