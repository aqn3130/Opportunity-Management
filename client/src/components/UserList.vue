<template>
  <v-card>
    <!--        <v-container fluid>-->
    <!--            <v-row-->
    <!--                    align="center"-->
    <!--            >-->
    <!--                <v-col cols="12" sm="6">-->
    <!--                    <v-select-->
    <!--                            v-model="value"-->
    <!--                            :items="users"-->
    <!--                            chips-->
    <!--                            label="User Selection"-->
    <!--                            multiple-->
    <!--                            outlined-->
    <!--                            @input="getUsers"-->
    <!--                    ></v-select>-->
    <!--                </v-col>-->
    <!--            </v-row>-->
    <!--        </v-container>-->
    <v-container>
      <!--<v-card-text>-->
      <!--    <v-text-field :value="username" @change="getUsers" label="Enter user name"></v-text-field>-->

      <!--    <v-combobox-->
      <!--            :value="name"-->
      <!--            :items="users"-->
      <!--            label="Select user to add"-->
      <!--            multiple-->
      <!--            @change=""-->
      <!--    ></v-combobox>-->
      <!--</v-card-text>-->

      <v-card max-width="400" class="mx-auto">
        <v-toolbar color="indigo" dark>
          <!--                    <v-toolbar-title>Users</v-toolbar-title>-->
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

            <!--                        <v-list-item-avatar>-->
            <!--                            <v-img :src="item.avatar"></v-img>-->
            <!--                        </v-list-item-avatar>-->
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
      // select: ['Vuetify', 'Programming'],
      // items: [
      //     'Programming',
      //     'Design',
      //     'Vue',
      //     'Vuetify',
      // ],

      // items: [
      //     { icon: true, title: 'Jason Oner', avatar: '' },
      //
      // ],
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

      // await this.setUsers([]);
      // this.setName(null);
      // console.log(this.selected);
    }
  },
  computed: {
    ...mapState("user", ["users", "name", "username", "loading"])
  }
};
</script>
