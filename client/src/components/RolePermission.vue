<template>
  <v-row>
    <v-col cols="12" md="8" offset-md="2">
      <v-data-table
        :headers="headers"
        :items="actions"
        sort-by="name"
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
                @change="initRoleActions"
                hint="select a role to view its permissions"
                persistent-hint
              ></v-select>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-on="on"
                  :disabled="!checkRoles"
                  >Add Action</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
<!--                        <v-select-->
<!--                          :items="user_names"-->
<!--                          label="Users*"-->
<!--                          required-->
<!--                          @change="onOptionChange"-->
<!--                          chips-->
<!--                          multiple-->
<!--                          v-model="selectedActions"-->
<!--                        ></v-select>-->
                        <v-text-field
                          v-model="action"
                          counter
                          :rules="actionRules"
                          label="Action*"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="action_description"
                          counter
                          :rules="action_descriptionRules"
                          label="Description*"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="add">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            edit
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'RolePermission',
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Description', value: 'description' },
      // { text: 'Actions', value: 'actions' },
    ],
    actionRules: [
      v => !!v || 'Action is required',
      v => (v && v.length <= 40) || 'Action must be less than 40 characters'
    ],
    action_descriptionRules: [
      v => !!v || 'Description is required',
      v =>
        (v && v.length <= 100) || 'Description must be less than 100 characters'
    ],
    actions: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      action: '',
      description: ''
    },
    user_names: [],
    selectedActions: [],
    actionsWithRoles: [],
    availableRoles: [],
    selectedRole: null,
    isRoles: false,
    loading: false,
    loadingText: 'Fetching roles...',
    action: null,
    action_description: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add Action' : 'Edit Action';
    },
    checkRoles() {
      return this.selectedRole;
      // return this.user_names.length > 0
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
        this.availableRoles.push(data[i].name);
      }
      this.loading = false;
    },
    async initRoleActions() {
      this.loading = true;
      this.user_names = [];
      const { data } = await this.$store.dispatch(
        'user/getRolePermissions',
        this.selectedRole
      );
      this.actions = data;
      this.loading = false;
    },
    editItem(item) {
      this.editedIndex = this.actions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.actions.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.actions.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async add() {
      const data = {};
      data.action = this.action;
      data.slug = this.action.toLowerCase().replace(/ /g,"_");
      data.description = this.action_description;
      data.role = this.selectedRole;
      // console.log(data);
      await this.$store.dispatch('user/saveRoleAction', data);
      await this.initRoleActions();
      this.close();
      this.action = null;
      this.action_description = null;
      this.selectedActions = [];
    },
    onOptionChange(item) {
      // this.add(item);
      // console.log(item);
    }
  }
};
</script>
