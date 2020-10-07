<template>
  <v-card flat height="48px" tile dark>
    <v-app-bar color="#455A64" app dense>
      <v-app-bar-nav-icon
        @click.stop="onSandwichMenuClick"
      ></v-app-bar-nav-icon>
      <v-toolbar-title
        class="v-card--link text-uppercase subtitle-2"
        @click="toHome"
      >
        Opportunity Management: {{ $route.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="text-lowercase" v-if="currentUser"
        ><v-icon left>mdi-account-circle</v-icon
        >{{ currentUser.username }}</v-btn
      >
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :color="color"
      temporary
      height="auto"
      width="300px"
      app
    >
      <v-card color="#455A64" tile flat height="150px">
        <v-list-item two-line>
          <!--                    <v-list-item-avatar>-->
          <!--                        <img src="">-->
          <!--                    </v-list-item-avatar>-->

          <v-list-item-content>
            <v-icon @click="drawer = false" class="justify-end mb-10"
              >close</v-icon
            >
            <v-list-item-title>PLM</v-list-item-title>
            <v-list-item-subtitle>Opportunity Management</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-divider></v-divider>
      <v-card flat color="white" tile :height="drawerHeight">
        <v-list dense nav light class="pt-5">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            v-model="group"
            :to="item.action"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <template v-slot:append>
        <div class="pa-1 grey lighten-2">
          <v-btn @click="logout" block light small>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      items: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          action: '/dashboard'
        },
        {
          title: 'New Opportunity',
          icon: 'add',
          action: '/new-opportunity'
        },
        {
          title: 'Edit Opportunity',
          icon: 'edit',
          action: '/edit-opportunity'
        },
        {
          title: 'Accounts',
          icon: 'supervisor_account',
          action: '/users'
        },
        {
          title: 'Admin Console',
          icon: 'settings'
        }
      ],
      drawer: false,
      group: null,
      color: '#fff',
      background: false,
      current_page: null,
      destinations: this.$store.destinations,
      isLoggedIn: false,
      currentPageName: '',
      drawerHeight: '600'
    };
  },
  methods: {
    onSandwichMenuClick() {
      if (JSON.stringify(this.formData) === JSON.stringify(this.currentOpp))
      this.drawer = !this.drawer;
      else window.BUS.$emit('opp-changed');
    },
    toHome() {
      this.$router.push({ path: '/' });
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'Login' });
    }
  },
  watch: {
    group() {
      this.drawer = false;
    }
  },
  computed: {
    ...mapState('auth', ['token', 'currentUser']),
    ...mapState(['formData', 'currentOpp'])
  },
  created() {
    window.addEventListener('resize', () => {
      this.drawerHeight = window.innerHeight - 200;
    });
  },
  beforeCreate() {},
  mounted() {
    this.currentPageName = this.$router.currentRoute.name;
  }
};
</script>
<style></style>
