<template>
    <form>
        <h3>Delete account</h3>
        <p>Deleting your account is permanent and irreversible. Proceed only if you understand these consequences.</p>
        <button class="form-button" @click="showDeleteAccountModal">Delete account</button>

        <ConfirmDeleteModal class="modal"
        itemName = "your account"
        itemType = "account"
        :itemId = "$store.state.username"
        :deleteFunction = "this.deleteAccount"
        />
    </form>
</template>

<script>

import ConfirmDeleteModal from "../common/ConfirmDeleteModal.vue";

export default {
    name: 'DeleteAccountForm',
    components: {
        ConfirmDeleteModal
    }, 
    methods: {
        showDeleteAccountModal(){
            this.$bvModal.show(`confirm-delete-modal-account-${this.$store.state.username}`);
        },
        async deleteAccount() {
            const options = {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            try {
                const r = await fetch('/api/users', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const text = await r.text();
                const res = text ? JSON.parse(text) : {user: null};
                this.$store.commit('setUsername', res.user ? res.user.username : null);
                this.$store.commit('setDisplayName', res.user ? res.user.displayName : null);

                this.$router.push({name: 'Home'}); // Goes to Home page after deleting account
                this.$store.commit('alert', {
                    message: 'Your account has been deleted!', status: 'success'
                });

            } catch (e) {
                this.$store.commit('alert', {
                    message: e, status: 'error'
                });
            }
        }
    }
}
</script>

<style scoped>
form {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

.modal{
    padding: 0 !important;
}
</style>