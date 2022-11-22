<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateSupportForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/supports/',
      method: 'POST',
      hasBody: true,
      fields: [
      {id: 'username', label: 'Username', value: ''},
      ],
      title: 'Add Supporter',
      refreshSupporter: true,
      refreshSupported: true,
      callback: () => {
        const message = 'Successfully added supporter!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
