<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for {{ $store.state.displayName}}</h2>
        <h2><HomeButton /></h2>
      </header>
      <div class="account-page-form-group">
        <ChangeUsernameForm 
          :currentLabel="'Current username'"
          :currentValue="$store.state.username"
        />
        <ChangeDisplayNameForm 
          :currentLabel="'Current Display Name'"
          :currentValue="$store.state.displayName"
        />
        <ChangePasswordForm />
      </div>
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <div class="account-page-form-group">
        <LogoutForm />
        <DeleteAccountForm />
      </div>
    </section>
  </main>
</template>

<script>
import HomeButton from '@/components/common/HomeButtonWithAction.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeDisplayNameForm from '@/components/Account/ChangeDisplayNameForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    HomeButton,
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeDisplayNameForm,
    DeleteAccountForm,
    LogoutForm
  },
};
</script>

<style scoped>
.account-page-form-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  gap: 20px;
}
</style>