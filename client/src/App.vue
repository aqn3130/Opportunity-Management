<template>
  <v-app>
    <NavBar v-if="currentUser"/>
    <v-content>
<!--      <v-container fluid>-->
<!--    <v-main>-->
      <router-view></router-view>
<!--    </v-main>-->
<!--      </v-container>-->
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import NavBar from './components/Navbar';
import {mapState} from "vuex";

export default {
  name: 'App',

  components: {
    NavBar
  },

  data: () => ({
  }),
    computed: {
      ...mapState('auth', ['currentUser'])
    }
};
</script>
