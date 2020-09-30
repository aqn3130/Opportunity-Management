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
