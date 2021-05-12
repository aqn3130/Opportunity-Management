<template>
  <v-card class="container mt-16">
    <v-card-text v-html="outageMessage"></v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Maintenance',
  data: () => ({
    outageMessage:
      "<div class='text-center text--primary'>Even systems need a break sometimes. PLM is currently offline undergoing\n" +
      'maintenance.<br>You will be notified when PLM is back online. Thank you for\n' +
      'your patience as we improve your experience.</div>'
  })
};
</script>

<style scoped></style>
