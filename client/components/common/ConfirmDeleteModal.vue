<template>
    <main>
        <b-modal :id="`confirm-delete-modal-${itemName}-${itemId}`" size="lg" title="Confirm Delete" hide-footer @hide="cancelDelete">
            <section class="content">
                <h4>Are you sure you want to delete your {{itemName}}?</h4>
                <p>This action cannot be undone. </p>
            </section>

            <section class="modal-footer">
                <button class="delete" @click="deleteItem">
                Yes, delete
                </button>
                <button @click="cancelDelete">
                    Cancel
                </button>
            </section>
        </b-modal>
    </main>
</template>

<script>

export default {
    name: 'ConfirmDeleteModal',
    props: {
        itemName: {
            type: String,
            required: true
        },
        deleteFunction: {
            type: Function,
            required: true
        },
        itemId: {
            type: String,
            required: true
        }
    }, 
    methods: {
        cancelDelete() {
            this.$bvModal.hide('confirm-delete-modal');
        },
        async deleteItem() {
            await this.deleteFunction(this.itemId);
            this.$bvModal.hide('confirm-delete-modal');
        }
    }
}
</script>

<style scoped>

.delete {
    background-color: rgba(200,0, 0, 1);
}
</style>