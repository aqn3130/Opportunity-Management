<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
      :search="search"
      v-model="selected"
    >
      <template v-slot:top>
        <v-toolbar flat color="grey lighten-3">
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New Item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <template v-for="(value, name, index) in editedItem">
                      <v-col
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                        v-if="name !== 'id'"
                      >
                        <v-text-field
                          v-model="editedItem[name]"
                          :label="name"
                        ></v-text-field>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider class="mb-2 purple"></v-divider>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          edit
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
export default {
  name: "DataTable",
  props: {
    title: String,
    defaultItem: Object,
    headers: Array,
    items: Array,
    labels: Array,
    editedIndex: Number,
    selected: Array,
    editedItem: Object,
    mCode: Array,
    close: Function,
    save: Function,
    formTitle: String,
    newRec: Array,
    isOpen: Boolean,
    editItem: Function,
    deleteItem: Function
  },
  data() {
    return {
      search: "",
      // dialog: false,
      isOpen: this.dialog
    };
  },
  // watch: {
  //     dialog (val) {
  //         this.isOpen = !this.isOpen;
  //         this.$emit('dialog', this.isOpen)
  //         val || this.close()
  //     },
  // },
  computed: {
    isOpen() {
      return !this.isOpen();
    }
  }
  // methods: {
  //     openDialog(){
  //         this.dialog = true;
  //     },
  //     closeDialog(){
  //         this.dialog = false;
  //     }
  // }
};
</script>
