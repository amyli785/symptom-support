<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for {{ $store.state.displayName}}</h2>
        <h2><font-awesome-icon @click ="goHome" class = "icon" icon="fa-solid fa-house" /></h2>
      </header>
      <ChangeUsernameForm 
        :currentLabel="'Current username'"
        :currentValue="$store.state.username"
      />
      <ChangeDisplayNameForm 
        :currentLabel="'Current Display Name'"
        :currentValue="$store.state.displayName"
      />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeDisplayNameForm from '@/components/Account/ChangeDisplayNameForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeDisplayNameForm,
    DeleteAccountForm,
    LogoutForm
  },
  methods: {
    goHome(){
      this.$router.push({name: 'Home'});
    },
  }
};
</script>
<style scoped>
h2 {
  margin: 0;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon{
  font-size: 40px;
}
.icon:hover {
  transform: scale(1.1, 1.1);
  cursor: pointer;
}
</style>
