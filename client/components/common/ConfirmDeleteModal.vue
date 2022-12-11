<template>
    <main>
        <b-modal :id="`confirm-delete-modal-${itemType}-${itemId}`" size="lg" title="Confirm Delete" hide-footer @hide="cancelDelete">
            <section class="content">
                <h4>Are you sure you want to delete {{itemName}}?</h4>
                <p>This action cannot be undone. </p>
            </section>

            <section class="modal-footer">
                <button class="form-button delete" @click="deleteItem">
                Yes, delete
                </button>
                <button class="form-button" @click="cancelDelete">
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
        itemType: {
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
            this.$bvModal.hide(`confirm-delete-modal-${this.itemType}-${this.itemId}`);
        },
        async deleteItem() {
            await this.deleteFunction();
            this.$bvModal.hide(`confirm-delete-modal-${this.itemType}-${this.itemId}`);
        }
    }
}
</script>

<style scoped>

.delete {
    background-color: rgba(200,0, 0, 1);
}
</style>