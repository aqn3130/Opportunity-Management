<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <!--            <v-icon-->
      <!--                    small-->
      <!--                    class="mr-2"-->
      <!--                    @click="editItem(item)"-->
      <!--            >-->
      <!--                mdi-pencil-->
      <!--            </v-icon>-->
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "username",
        align: "start",
        sortable: false,
        value: "username"
      },
      { text: "email", value: "email" },
      { text: "Actions", value: "actions" }
    ],
    rows: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    ...mapState(["userData", "userAdded"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  async created() {
    await this.getRecords();
    window.BUS.$on('user-added', async () => {
      await this.getRecords();
    });
  },

  methods: {
    getRecords: async function() {
      await this.$store.dispatch("setCurrentTable", "users");
      const data = await this.$store.dispatch("getRecords", '');
      this.rows = data;
    },

    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      await this.$store.dispatch("deleteRecord", item.id);
      await this.getRecords();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rows[this.editedIndex], this.editedItem);
      } else {
        this.rows.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
