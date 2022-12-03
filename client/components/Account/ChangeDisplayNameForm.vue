<!-- Form for changing display name (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeDisplayNameForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      setDisplayName: true,
      fields: [
        {id: 'displayName', label: 'New Display Name', value: ''}
      ],
      validationFunction: (fieldValues) => {
        const displayNameRegex = /^[a-zA-Z ]+$/;
        return displayNameRegex.test(fieldValues[0].value);
      },
      title: 'Change display name',
      callback: () => {
        const message = 'Successfully changed display name!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>