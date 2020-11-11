<template>
  <v-container>
    <v-card v-if="$auth.isAdmin() || $auth.isITSupport()">
      <v-tabs
        v-model="tab"
        background-color="#4b636e"
        centered
        dark
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#tab-1">
          Users
        </v-tab>

        <v-tab href="#tab-2">
          Roles
        </v-tab>

        <v-tab href="#tab-3">
          Users Roles
        </v-tab>

        <v-tab href="#tab-4">
          Roles Actions
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :value="'tab-1'">
          <v-card flat>
            <UserList />
            <UserTable />
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <v-card flat>
            <Role />
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-3'">
          <v-card flat>
            <UserRoles />
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-4'">
          <v-card flat>
            <RolePermission />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <p v-else>
      You do not have access to this page, please contact your system
      administrator.
    </p>
  </v-container>
</template>
<script>
import UserList from '../components/UserList';
import UserTable from '../components/UserTable';
import Role from '@/components/Role';
import UserRoles from '@/components/UserRoles';
import RolePermission from "@/components/RolePermission";
import { mapMutations } from 'vuex';

export default {
  name: 'Users',
  components: {
    UserList,
    UserTable,
    Role,
    UserRoles,
    RolePermission
  },
  data: () => ({
    tab: null
  }),
  methods: {
    ...mapMutations(['getRecords']),
    onUserAdd() {
      alert('user added');
    }
  }
};
</script>
