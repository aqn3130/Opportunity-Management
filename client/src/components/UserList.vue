<template>
  <v-card>
    <v-container>
      <v-toolbar flat dense height="20">
        <template>
          <v-fab-transition>
            <v-btn
              color="#455A64"
              fab
              dark
              small
              absolute
              bottom
              right
              @click="userPickerDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </template>
      </v-toolbar>
      <v-dialog v-model="userPickerDialog" width="500">
        <v-card class="mx-auto" flat>
          <v-toolbar flat>
            <v-text-field
              class="mt-5"
              @change="getUsers"
              placeholder="Lookup user by name"
              label="User Picker"
              v-model="searchStr"
              @click:clear="resetSearch"
              clearable
              prepend-inner-icon="search"
            >
            </v-text-field>
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
              @click="add(item.id, item)"
            >
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn text :loading="userAddLoading" v-if="userId === item.id">
                  Add
                </v-btn>
                <v-btn text v-else>
                  Add
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {
      selected: [],
      userPickerDialog: false,
      userAddLoading: false,
      userId: null,
      searchStr: null
    };
  },
  created() {},
  methods: {
    ...mapActions('user', ['searchUser', 'addUser', 'resetSearch']),
    ...mapMutations('user', ['setUsers', 'setName', 'setUser']),
    async getUsers(name) {
      await this.setName(name);
      await this.searchUser();
    },
    async add(user, item) {
      this.userId = item.id;
      this.userAddLoading = true;
      this.setUser(user);
      await this.addUser();
      window.BUS.$emit('user-added');
      this.userAddLoading = false;
      this.userPickerDialog = false;
      this.setUser(null);
      this.searchStr = null;
      this.userId = null;
    }
  },
  computed: {
    ...mapState('user', ['users', 'name', 'username', 'loading'])
  }
};
</script>
