<template>
  <v-app>
    <NavBar />
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
import HelloWorld from './components/HelloWorld';
import NavBar from './components/Navbar';

export default {
  name: 'App',

  components: {
    HelloWorld,
    NavBar
  },

  data: () => ({
    //
  }),
};
</script>
