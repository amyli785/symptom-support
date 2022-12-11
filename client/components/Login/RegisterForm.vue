<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUserDetails: true,
      fields: [
        {id: 'username', label: 'Username', description: 'letters and numbers only', value: ''},
        {id: 'displayName', label: 'Display Name', value: ''},
        {id: 'password', label: 'Password', description: 'between 6 and 50 characters', value: ''}
      ],
      validationFunction: (fields) => {
        const username = fields[0].value;
        const displayName = fields[1].value;
        const password = fields[2].value;
        const usernameRegex = /^\w+$/i;
        const passwordRegex = /^\S+$/;
        return usernameRegex.test(username) && passwordRegex.test(password) && displayName.length > 0 
                && password.length >= 6 && password.length <= 50;
      },
      title: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Home'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
