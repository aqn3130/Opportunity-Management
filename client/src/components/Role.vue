<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card flat>
            <v-card-title>
              Create Roles
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="name"
                counter
                :rules="nameRules"
                label="Role*"
                required
              ></v-text-field>
              <v-text-field
                v-model="description"
                counter
                :rules="nameRules"
                label="Description*"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
                small
              >
                Create
              </v-btn>

<!--              <v-btn color="error" class="mr-4" @click="reset" small>-->
<!--                Reset Form-->
<!--              </v-btn>-->
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card flat>
            <v-list two-line subheader>
              <v-subheader>Available Roles</v-subheader>
              <v-list-item v-for="role in roles" :key="role.name">
                <v-list-item-content>
                  <v-list-item-title v-text="role.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="role.description"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon @click="deleteRole(role.name)" :disabled="currentUser.user.username !== 'aqn3130'">
                    <v-icon color="grey lighten-1" small>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'Role',
  data: () => ({
    valid: true,
    name: '',
    description: '',
    nameRules: [
      v => !!v || 'required',
      v => (v && v.length <= 255) || 'must be less than 255 characters'
    ],
    select: null,
    items: ['Administrator', 'Standard', 'SPI', 'Marketing'],
    roles: []
  }),
  async created() {
    await this.getRoles();
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    async getRoles() {
      const { data } = await this.$store.dispatch('user/getAllRoles');
      this.roles = data;
      for (let r in data) {
        if (data[r] && this.items.indexOf(data[r].name) !== -1) {
          this.items.splice(this.items.indexOf(data[r].name), 1);
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        this.save(this.getFormData());
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    async save(data) {
      await this.$store.dispatch('user/saveRole', data);
      await this.getRoles();
      this.reset();
    },
    getFormData() {
      const data_map = new Map();
      for (let i in this.$refs.form._data.inputs) {
        let formLable = this.$refs.form._data.inputs[i].label.replace('*', '');
        let formValue = this.$refs.form._data.inputs[i].value;

        if (formLable === 'Role') {
          formLable = 'Roles';
        }
        data_map.set(formLable, formValue);
      }
      const data = Object.fromEntries(data_map);
      // console.log(data);
      return data;
    },
    async deleteRole(role) {
      await this.$store.dispatch('user/deleteRole', role);
      await this.getRoles();
    }
  }
};
</script>
