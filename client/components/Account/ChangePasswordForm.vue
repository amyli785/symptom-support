<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePasswordForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'password', label: 'Password', description: 'between 6 and 50 characters', value: ''}
      ],
      validationFunction: (fieldValues) => {
        const passwordRegex = /^\S+$/;
        return passwordRegex.test(fieldValues[0].value) && (6 <= fieldValues[0].value.length) && (fieldValues[0].value.length <= 50);
      },
      title: 'Change password',
      callback: () => {
        const message = 'Successfully changed password!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
