<template>
  <v-container fluid class="px-8">
    <v-data-table
      :headers="headers"
      :items="countryRegionTerritories"
      sort-by="Country"
      class="elevation-1 text-no-wrap"
      :loading="loading"
      :search="searchStr"
    >
      <template v-slot:top>
        <v-toolbar flat color="#4b636e" dark dense>
          <v-toolbar-title class="overline">Country Region Territory</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchStr"
            clearable
            prepend-inner-icon="search"
            outlined
            flat
            dense
            class="mt-6"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#bb4d00" dark v-bind="attrs" v-on="on" small fab absolute top right>
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
                        v-model="editedItem.Country"
                        label="Country"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Region"
                        label="Region"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Territory"
                        label="Territory"
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
  name: 'CountryRegionTerritory',
  data: () => ({
    searchStr: '',
    dialog: false,
    dialogDelete: false,
    loading: false,
    headers: [
      {
        text: 'Country',
        align: 'left',
        sortable: true,
        value: 'Country'
      },
      { text: 'CRM Country Code', value: 'CRMCountryCode' },
      { text: 'Region', value: 'Region' },
      { text: 'Territory', value: 'Territory' },
      { text: 'Currency', value: 'Currency' },
      { text: 'Actions', value: 'actions' }
    ],
    countryRegionTerritories: [],
    editedIndex: -1,
    editedItem: {
      Country: '',
      Region: '',
      Territory: ''
    },
    defaultItem: {
      Country: '',
      Region: '',
      Territory: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
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
      await this.$store.dispatch('setCurrentTable', 'Country_Region_Territory');
      this.countryRegionTerritories = await this.$store.dispatch(
        'getCountryRegionTerritory',
        ''
      );
      this.loading = false;
      // console.log(this.countryRegionTerritories);
    },

    editItem(item) {
      this.editedIndex = this.countryRegionTerritories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.countryRegionTerritories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$store.dispatch(
        'deleteCountryRegionTerritory',
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
        // console.log('1', this.editedItem);
        const data = {
          data: this.editedItem
        };
        await this.$store.dispatch('updateCountryRegionTerritory', data);
        await this.initialize();
      } else {
        // this.salesReps.push(this.editedItem);
        // console.log('2', this.editedItem);
        this.editedItem.Id = parseInt(this.editedItem.Id);
        await this.$store.dispatch(
          'createCountryRegionTerritory',
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
