<template>
  <v-container fluid class="px-8">
    <v-data-table
      :headers="headers"
      :items="salesFunnel"
      sort-by="Id"
      class="elevation-1 text-no-wrap"
      :loading="loading"
      :search="searchStr"
    >
      <template v-slot:top>
        <v-toolbar flat color="#4b636e" dark dense>
          <v-toolbar-title class="overline">Sales Funnel</v-toolbar-title>
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
              <v-btn
                color="#bb4d00"
                dark
                v-bind="attrs"
                v-on="on"
                small
                fab
                top
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
                  <v-form ref="salesFunnelForm" lazy-validation v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Id"
                          label="Id"
                          readonly
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Stage_No"
                          label="Stage No *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Sales_Stage"
                          label="Sales Stage *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.OpportunityTableKey"
                          label="Opportunity Table Key *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Probability__Weighted_Value"
                          label="Probability Weighted Value *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Classification"
                          label="Classification *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Key"
                          label="Key *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.StageGroup"
                          label="Stage Group *"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Notes"
                          label="Notes"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="validate"
                  :disabled="!valid"
                >
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
import moment from 'moment';

export default {
  name: 'SalesFunnel',
  components: {},
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
      { text: 'Stage No', value: 'Stage_No' },
      { text: 'Sales Stage', value: 'Sales_Stage' },
      { text: 'Opportunity Table Key', value: 'OpportunityTableKey' },
      { text: 'Probability Weighted Value', value: 'Probability__Weighted_Value' },
      { text: 'Classification', value: 'Classification' },
      { text: 'Key', value: 'Key' },
      { text: 'StageGroup', value: 'StageGroup' },
      { text: 'Notes', value: 'Notes' },
      { text: 'Actions', value: 'actions' }
    ],
    salesFunnel: [],
    editedIndex: -1,
    editedItem: {
      Id: '',
      Stage_No: '',
      Sales_Stage: '',
      OpportunityTableKey: '',
      Probability__Weighted_Value: '',
      Classification: '',
      Key: '',
      StageGroup: '',
      Notes: ''
    },
    defaultItem: {
      Id: '',
      Stage_No: '',
      Sales_Stage: '',
      OpportunityTableKey: '',
      Probability__Weighted_Value: '',
      Classification: '',
      Key: '',
      StageGroup: '',
      Notes: ''
    },
    valid: true,
    nameRules: [v => !!v || 'This field is required']
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Sales Funnel' : 'Edit Sales Funnel';
    }
  },
  filters: {
    convertDate: value => {
      if (!value) return null;
      value = value.toString();
      return moment(value).format('YYYY-MM-DD');
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
      await this.$store.dispatch('setCurrentTable', 'Sales_Funnel');
      this.salesFunnel = await this.$store.dispatch('getSalesFunnel', '');
      this.loading = false;
      // console.log(this.countryRegionTerritories);
    },

    editItem(item) {
      this.editedIndex = this.salesFunnel.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.salesFunnel.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$store.dispatch('deleteRecord', this.editedItem.Id);
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
        await this.$store.dispatch('setCurrentTable', 'Sales_Funnel');
        await this.$store.dispatch('updateRecord', this.editedItem);
        await this.initialize();
      } else {
        await this.$store.dispatch('setCurrentTable', 'Sales_Funnel');
        delete this.editedItem.Id;
        await this.$store.dispatch('createRecord', this.editedItem);
        await this.initialize();
      }
      this.close();
    },
    formatDate(date, dateFormat, convFormat) {
      if (!date) return null;
      date = date.toString();
      return (
        moment(date, convFormat)
          // .utc()
          .format(dateFormat)
      );
    },
    validate() {
      if (this.$refs.salesFunnelForm.validate()) {
        this.save();
      }
    }
  }
};
</script>

<style scoped></style>
