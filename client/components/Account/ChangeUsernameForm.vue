<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeUsernameForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'New Username', description: 'letters and numbers only', value: ''}
      ],
      validationFunction: (fieldValues) => {
        const usernameRegex = /^\w+$/i;
        return usernameRegex.test(fieldValues[0].value);
      },
      title: 'Change username',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Successfully changed display username!', status: 'success'
        });
      }
    };
  }
};
</script>
