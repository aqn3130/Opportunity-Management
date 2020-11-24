<template>
  <v-app>
    <NavBar v-if="currentUser" />
    <v-main style="background-color: #eceff1">
      <router-view></router-view>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import NavBar from './components/Navbar';
import { mapState } from 'vuex';

export default {
  name: 'App',

  components: {
    NavBar
  },

  data: () => ({}),
  computed: {
    ...mapState('auth', ['currentUser'])
  }
};
</script>
<style>
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  font-size: 12px !important;
}
.v-input input {
  font-size: 12px;
}
.v-input .v-label {
  font-size: 15px;
}
</style>
