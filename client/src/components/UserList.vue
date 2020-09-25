<template>
  <v-card>
    <v-container>
      <v-card max-width="400" class="mx-auto" flat>
        <v-toolbar flat>
          <v-text-field
            class="mt-5"
            :value="username"
            @change="getUsers"
            placeholder="Lookup user by name"
            label="User Picker"
          >
          </v-text-field>
          <v-btn icon v-if="users.length === 0">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon v-else @click="resetSearch">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            bottom
          ></v-progress-linear>
          <v-list-item
            v-for="item in users"
            :key="item.id"
            @click="add(item.id)"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn text>
                Add
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-card>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      selected: []
    };
  },
  created() {},
  methods: {
    ...mapActions("user", ["searchUser", "addUser", "resetSearch"]),
    ...mapMutations("user", ["setUsers", "setName", "setUser"]),
    async getUsers(name) {
      await this.setName(name);
      await this.searchUser();
    },
    async add(user) {
      this.setUser(user);
      await this.addUser();
      window.BUS.$emit('user-added');
    }
  },
  computed: {
    ...mapState("user", ["users", "name", "username", "loading"])
  }
};
</script>
