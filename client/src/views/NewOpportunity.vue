<template>
  <Opportunity :title="title" />
</template>

<script>
import Opportunity from '../components/Opportunity';
export default {
  components: {
    Opportunity
  },
  data() {
    return {
      title: 'New Opportunity'
    };
  },
  methods: {}
};
</script>

<style scoped></style>
