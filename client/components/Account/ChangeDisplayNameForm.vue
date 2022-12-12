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
        return fieldValues[0].value.trim().length > 0;
      },
      title: 'Change display name',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Successfully changed display name!', status: 'success'
        });
      }
    };
  }
};
</script>