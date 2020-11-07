<template>
  <v-container fluid class="px-8">
    <v-data-table
      :headers="headers"
      :items="products"
      sort-by="Id"
      class="elevation-1 text-no-wrap"
      :loading="loading"
      :search="searchStr"
    >
      <template v-slot:top>
        <v-toolbar flat color="grey lighten-2">
          <v-toolbar-title>Products</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchStr"
            clearable
            prepend-inner-icon="search"
            outlined
            flat
            dense
            class="mt-5"
            light
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#455A64" dark v-bind="attrs" v-on="on" small fab>
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Id"
                        label="Id"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Category_ID"
                        label="Category ID"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Category_Description"
                        label="Category Description"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Title_Category"
                        label="Title Category"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Product_Group_Category"
                        label="Product Group Category"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Finance_Category"
                        label="Finance Category"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'Products',
  data: () => ({
    searchStr: '',
    dialog: false,
    dialogDelete: false,
    loading: false,
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: true,
        value: 'Id'
      },
      { text: 'Category ID', value: 'Category_ID' },
      { text: 'Category Description', value: 'Category_Description' },
      { text: 'Title Category', value: 'Title_Category' },
      { text: 'Product Group Category', value: 'Product_Group_Category' },
      { text: 'Finance Category', value: 'Finance_Category' },
      { text: 'Actions', value: 'actions' }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      Id: '',
      Category_ID: '',
      Category_Description: '',
      Title_Category: '',
      Product_Group_Category: '',
      Finance_Category: ''
    },
    defaultItem: {
      // Id: '',
      Category_ID: '',
      Category_Description: '',
      Title_Category: '',
      Product_Group_Category: '',
      Finance_Category: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Product' : 'Edit Product';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      await this.$store.dispatch('setCurrentTable', 'Products');
      this.products = await this.$store.dispatch(
        'getProducts',
        ''
      );
      this.loading = false;
      // console.log(this.countryRegionTerritories);
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$store.dispatch(
        'deleteRecord',
        this.editedItem.Id
      );
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.initialize();
    },

    async save() {
      if (this.editedIndex > -1) {
        const id = this.editedItem.Id;
        delete this.editedItem.Id;
        this.editedItem.id = id;
        await this.$store.dispatch('updateRecord', this.editedItem);
        await this.initialize();
      } else {
        // this.salesReps.push(this.editedItem);
        // console.log('2', this.editedItem);
        this.editedItem.Id = parseInt(this.editedItem.Id);
        await this.$store.dispatch(
          'createRecord',
          this.editedItem
        );
        await this.initialize();
      }
      this.close();
    }
  }
};
</script>

<style scoped></style>
