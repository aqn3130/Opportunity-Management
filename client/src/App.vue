<template>
  <v-app>
    <NavBar v-if="currentUser" />
    <v-content style="background-color: #eceff1">
      <router-view></router-view>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import NavBar from "./components/Navbar";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    NavBar
  },

  data: () => ({}),
  computed: {
    ...mapState("auth", ["currentUser"])
  }
};
</script>
