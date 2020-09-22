<template>
  <div>
    <div
      fluid
      v-if="
        authUser.username === 'stephen.cohen' || authUser.username === 'aqn3130'
      "
    >
      <v-card
        style="z-index: 1;margin-top: -50px"
        color="primary"
        height="150"
        width="auto"
        tile
        dark
      >
        <v-card-text class="text-center overline">
          User Management
        </v-card-text>
      </v-card>
      <v-layout style="margin-top: -90px">
        <v-flex style="z-index: 2">
          <v-card
            flat
            class="justify-center ml-auto mr-auto transparent"
            max-width="800"
          >
            <v-card-title>
              <v-toolbar flat color="grey lighten-3">
                <v-toolbar-title>
                  Users
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-title>
                  <!--          <v-row justify="center">-->
                  <v-dialog v-model="dialog" scrollable max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        small
                      >
                        Add User
                      </v-btn>
                    </template>
                    <v-card>
                      <!--                <v-card-title>Search User</v-card-title>-->
                      <v-text-field
                        outlined
                        dense
                        placeholder="Search user"
                        class="pa-5 mx-5"
                        prepend-inner-icon="search"
                        @change="searchUsers"
                        v-model="searchString"
                        :loading="isSearching"
                      ></v-text-field>

                      <v-divider></v-divider>

                      <v-card-text style="height: 300px;">
                        <v-radio-group v-model="dialogm1" column>
                          <v-radio
                            v-for="n in items"
                            :key="n.id"
                            :label="`${n.text}`"
                            :value="n.text"
                            @change="selectedUserId = n.id"
                          ></v-radio>
                        </v-radio-group>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="onDialogClosed"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="AddUser"
                          :loading="isLoading"
                        >
                          Add
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <!--          </v-row>-->
                </v-toolbar-title>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="rows"
                class="elevation-1 mt-n5"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    :loading="isDeleting"
                    text
                    v-if="item.id === userIdToBeDeleted"
                  >
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                  <v-btn text v-else>
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <p v-else class="pa-5">
      You do not have access to this page, please contact your system
      administrator.
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Account",
  data() {
    return {
      items: [],
      isLoading: false,
      headers: [
        { text: "First Name", align: "left", value: "first_name" },
        { text: "Last Name", align: "left", value: "last_name" },
        { text: "Email", align: "left", value: "email" },
        { text: "Actions", align: "left", value: "actions" }
      ],
      dialogm1: "",
      dialog: false,
      selectedUserId: null,
      searchString: null,
      rows: [],
      isSearching: false,
      isDeleting: false,
      userIdToBeDeleted: null
    };
  },
  created() {
    // this.searchUsers('ahmad');
    this.getUsers();
  },
  computed: {
    ...mapState(["authUser"])
  },
  methods: {
    async searchUsers(val) {
      if (val && val.length < 3) {
        return;
      }
      this.isSearching = true;
      try {
        const opts = {
          search: val
        };
        const { data } = await axios.post("api/search-user", opts);
        this.items = data.names;
        await this.$nextTick();
      } catch (error) {
        this.items = [];
        await this.$nextTick();
      }
      this.isSearching = false;
    },
    // setUserId (id) {
    //   this.selectedUserId = id;
    // },
    async AddUser() {
      this.isLoading = true;
      const id = {
        userId: this.selectedUserId
      };
      await axios.post("api/register-user", id);
      await this.getUsers();
      // console.log(this.selectedUserId);
      this.items = [];
      this.searchString = null;
      this.dialog = false;
      this.isLoading = false;
    },
    onDialogClosed() {
      this.dialog = false;
      this.searchString = null;
      this.items = [];
    },
    async getUsers() {
      const { data } = await axios.get("api/users");
      this.rows = data;
    },
    async deleteItem(user) {
      this.userIdToBeDeleted = user.id;
      this.isDeleting = true;
      await axios.delete(`api/users/${user.id}`);
      await this.getUsers();
      this.isDeleting = false;
    }
  }
};
</script>

<style scoped></style>
