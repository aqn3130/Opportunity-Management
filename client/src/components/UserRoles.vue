<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <v-data-table
          :headers="headers"
          :items="users"
          sort-by="calories"
          class="elevation-1"
          :loading="loading"
          :loading-text="loadingText"
        >
          <template v-slot:top>
            <v-toolbar flat color="grey lighten-3">
              <v-toolbar-title>
                <v-select
                  label="Roles"
                  v-model="selectedRole"
                  :items="availableRoles"
                  @change="initializeUsers"
                  hint="select a role to view who has it"
                  persistent-hint
                ></v-select>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="700px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="#bb4d00"
                    dark
                    class="mb-2"
                    v-on="on"
                    :disabled="!checkRoles"
                    small
                    fab
                    bottom
                    right
                    absolute
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-data-table
                            v-model="selectedUsers"
                            :items="user_names"
                            :headers="userList"
                            :single-select="singleSelect"
                            item-key="username"
                            show-select
                            class="elevation-1"
                            :items-per-page="5"
                          >
                            <template v-slot:top>
                              <v-switch
                                v-model="singleSelect"
                                label="Single select"
                                class="pa-3"
                              ></v-switch>
                            </template>

                            <template v-slot:item.first_name="{ item }">
                              <p v-if="item.first_name">
                                {{ item.first_name }}
                              </p>
                            </template>
                            <template v-slot:item.name="{ item }">
                              <p v-if="item.username">{{ item.username }}</p>
                            </template>
                            <template v-slot:item.name="{ item }">
                              <p v-if="item.email">{{ item.email }}</p>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="add"
                      :disabled="!selectedUsers.length > 0"
                      >Add</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              edit
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              delete
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn text :loading="deleteRoleLoading" v-if="item.user === user">
              <v-icon @click="deleteRole(item)" small>delete</v-icon>
            </v-btn>
            <v-btn text v-else>
              <v-icon @click="deleteRole(item)" small>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'UserRoles',
  data: () => ({
    dialog: false,
    headers: [
      { text: 'First Name', value: 'first_name', align: 'left' },
      { text: 'Last Name', value: 'last_name' },
      { text: 'user', value: 'user' },
      { text: 'Email', value: 'email' },
      { text: 'roles', value: 'roles' },
      { text: 'Actions', value: 'actions' }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      username: '',
      email: ''
    },
    user_names: [],
    selectedUsers: [],
    usersWithRoles: [],
    availableRoles: [],
    selectedRole: null,
    isRoles: false,
    loading: false,
    loadingText: 'Fetching roles...',
    userList: [
      {
        text: 'First Name',
        value: 'first_name',
        align: 'left'
      },
      {
        text: 'Username',
        value: 'username'
      },
      {
        text: 'Email',
        value: 'email'
      }
    ],
    singleSelect: false,
    deleteRoleLoading: false,
    user: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add User' : 'Edit User';
    },
    checkRoles() {
      if (!this.user_names) {
        return false;
      }
      return this.user_names.length > 0;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.getAllRoles();
    // this.initializeUsers()
    // this.initRoles();
  },

  methods: {
    async getAllRoles() {
      this.loading = true;
      let { data } = await this.$store.dispatch('user/getAllRoles');
      // console.log(data);
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          this.availableRoles.push(data[i].name);
        }
      }
      this.loading = false;
    },
    async initializeUsers() {
      this.loading = true;
      this.user_names = [];
      await this.$store.dispatch('setCurrentTable', 'users');
      const data = await this.$store.dispatch('getRecords', '');
      this.user_names = data;
      await this.initRoles(data);
      this.loading = false;
      // console.log(data, this.user_names);
    },
    async initRoles(arr) {
      this.loading = true;
      this.usersWithRoles = [];
      for (let i in arr) {
        if (arr.hasOwnProperty(i)) {
          const { data } = await this.$store.dispatch(
            'user/getUserRoles',
            arr[i].username
          );
          if (
            data.length > 0 &&
            data.indexOf(this.selectedRole.toLowerCase()) !== -1
          ) {
            const obj = {
              user: arr[i].username,
              first_name: arr[i].first_name,
              last_name: arr[i].last_name,
              email: arr[i].email,
              roles: data
            };
            this.usersWithRoles.push(obj);
          }
        }
      }
      this.users = this.usersWithRoles;
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.users.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async add() {
      for (let i in this.selectedUsers) {
        const data = {
          username: this.selectedUsers[i].username,
          role: this.selectedRole
          // role: 'Administrator'
        };
        await this.$store.dispatch('user/setRole', data);
      }

      this.close();
      await this.initRoles(this.user_names);
      // console.log(this.selectedUsers);
      this.selectedUsers = [];
    },
    async deleteRole(item) {
      // console.log(item);
      this.user = item.user;
      this.deleteRoleLoading = true;
      const user = {
        user: item.user,
        role: this.selectedRole.toLowerCase()
      };
      // console.log(user);
      await this.$store.dispatch('user/detachRole', user);
      await this.initRoles(this.user_names);
      this.deleteRoleLoading = false;
    }
  }
};
</script>
