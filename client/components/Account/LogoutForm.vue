<!-- Form for signing out (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LogoutForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'DELETE',
      setUserDetails: true,
      title: 'Sign out',
      fields: [],
      content: 'Taking a break? See you later.',
      callback: () => {
        this.$store.commit('updateSupporting',[]);
        this.$store.commit('updateSupporter',[]);
        this.$store.commit('updateSupportingRequest',[]);
        this.$store.commit('updateSupporterRequest',[]);
        this.$store.commit('setUsername',null);
        localStorage.removeItem('username');
        this.$store.commit('clearEntries');
        this.$store.commit('cleanEntryStatus');
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
        this.$router.push({name: 'Login'}); // Goes to Home page after signing out
      }
    };
  }
};
</script>
