<template>
    <main>
        <b-modal
            :id="`confirm-delete-modal-${itemType}-${itemId}`"
            class="confirm-delete-modal"
            title="Confirm Delete"
            :hide-header="true"
            :hide-footer="true"
            size="lg" 
            @hide="cancelDelete"
        >
            <header>
                <h2>Confirm Delete</h2>
                <h2><XButton @click="cancelDelete"/></h2>
            </header>
            <section>
                <h4>Are you sure you want to delete {{itemName}}?</h4>
                <p>This action cannot be undone. </p>
            </section>
            <section class="confirm-delete-buttons">
                <button class="form-button delete-button" @click="deleteItem">Yes, delete</button>
                <button class="form-button cancel-button" @click="cancelDelete">Cancel</button>
            </section>
        </b-modal>
    </main>
</template>

<script>
import XButton from '@/components/common/XButton.vue';

export default {
    name: 'ConfirmDeleteModal',
    components: {XButton},
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
            this.cancelDelete();
        }
    }
}
</script>

<style scoped>

.confirm-delete-modal {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    gap: 10px;
}

.confirm-delete-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    gap: 10px;
}

.delete-button {
  background-color: var(--salmon);
  border: 2px solid var(--salmon);
  color: white;
}

.cancel-button {
  background-color: white;
  border: 2px solid var(--dark-blue);
  color: var(--dark-blue);
}

</style>