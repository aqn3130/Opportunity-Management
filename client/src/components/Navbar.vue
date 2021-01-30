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
        >{{ currentUser.user.username }}</v-btn
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
          <v-list-item to="/dashboard">
            <v-list-item-icon><v-icon>dashboard</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/dashboardAdmin" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>list_alt</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard Admin</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/new-opportunity">
            <v-list-item-icon><v-icon>add</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>New Opportunity</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
<!--          <v-list-item to="/activities">-->
<!--            <v-list-item-icon><v-icon>local_activity</v-icon></v-list-item-icon>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title>Activity Tracker</v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
          <v-list-item to="/opportunities" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>select_all</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>All Opportunities</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/sales-rep" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>groups</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sales Rep</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/country-region-territory" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>flag</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Country Region Territory</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/industry" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>category</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Industries</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/product" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>storefront</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Products</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
<!--          <v-list-item to="/campaign" v-if="currentUser.roles.includes('admin')">-->
<!--            <v-list-item-icon><v-icon>campaign</v-icon></v-list-item-icon>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title>Campaign</v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
          <v-list-item to="/salesFunnel" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>local_atm</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sales Funnel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/states" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon><v-icon>map</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>States</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/users" v-if="currentUser.roles.includes('admin')">
            <v-list-item-icon
              ><v-icon>supervisor_account</v-icon></v-list-item-icon
            >
            <v-list-item-content>
              <v-list-item-title>Accounts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/gbqReports">
            <v-list-item-icon
            ><v-icon>window</v-icon></v-list-item-icon
            >
            <v-list-item-content>
              <v-list-item-title>PLM Reports</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
<!--          <v-list-item-->
<!--            href="https://datastudio.google.com/reporting/1V3LWY3BX7uonW-cGBFDTiF3ffOE7yZNP/page/lAXy"-->
<!--            target="_blank"-->
<!--          >-->
<!--            <v-list-item-icon><v-icon>window</v-icon></v-list-item-icon>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title>PLM Reports</v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
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
      if (JSON.stringify(this.formData) === JSON.stringify(this.currentOpp))
        this.$router.push({ path: '/' });
      else window.BUS.$emit('go-home');
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
    window.BUS.$on('leave-page', () => {
      this.drawer = !this.drawer;
    });
    window.BUS.$on('nav-home', () => {
      this.$router.push({ name: 'Dashboard' });
    });
  },
  beforeCreate() {},
  mounted() {
    this.currentPageName = this.$router.currentRoute.name;
  }
};
</script>
<style></style>
