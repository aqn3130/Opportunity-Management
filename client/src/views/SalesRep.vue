<template>
  <v-container fluid class="px-8">
    <v-data-table
      :headers="headers"
      :items="salesReps"
      sort-by="Employee_FirstName"
      class="elevation-1 text-no-wrap"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat color="grey lighten-2">
          <v-toolbar-title>Sales Reps</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
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
                        v-model="editedItem.Location"
                        label="Location"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Employee_FirstName"
                        label="Employee FirstName"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Employee_Surname"
                        label="Employee Surname"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.SalesRep"
                        label="SalesRep"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Job_Title"
                        label="Job_Title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Line_Manager__First_name"
                        label="Line Manager First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Line_Manager__Surname"
                        label="Line Manager Surname"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.BPID"
                        label="BPID"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Type"
                        label="Type"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Full_Name"
                        label="Full Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Email"
                        label="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Reporting_Level_RD"
                        label="Reporting Level RD"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ReportingLevelOne"
                        label="Reporting Level One"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.ReportingLevelTwo"
                        label="Reporting Level Two"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.Notes"
                        label="Notes"
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
  name: 'SalesRep',
  data: () => ({
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
      { text: 'Location', value: 'Location' },
      { text: 'Employee First Name', value: 'Employee_FirstName' },
      { text: 'Employee Surname', value: 'Employee_Surname' },
      { text: 'Sales Rep', value: 'SalesRep' },
      { text: 'Job Title', value: 'Job_Title' },
      { text: 'Line Manager First Name', value: 'Line_Manager__First_name' },
      { text: 'Line Manager Surname', value: 'Line_Manager__Surname' },
      { text: 'BPID', value: 'BPID' },
      { text: 'Type', value: 'Type' },
      { text: 'Full Name', value: 'Full_Name' },
      { text: 'Email', value: 'Email' },
      { text: 'Reporting Level RD', value: 'Reporting_Level_RD' },
      { text: 'Reporting Level One', value: 'ReportingLevelOne' },
      { text: 'Reporting Level Two', value: 'ReportingLevelTwo' },
      { text: 'Notes', value: 'Notes' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    salesReps: [],
    editedIndex: -1,
    editedItem: {
      Id: '',
      Location: '',
      Employee_FirstName: '',
      Employee_Surname: '',
      SalesRep: '',
      Job_Title: '',
      Line_Manager__First_name: '',
      Line_Manager__Surname: '',
      BPID: '',
      Type: '',
      Full_Name: '',
      Email: '',
      Reporting_Level_RD: '',
      ReportingLevelOne: '',
      ReportingLevelTwo: '',
      Notes: ''
    },
    defaultItem: {
      Id: '',
      Location: '',
      Employee_FirstName: '',
      Employee_Surname: '',
      SalesRep: '',
      Job_Title: '',
      Line_Manager__First_name: '',
      Line_Manager__Surname: '',
      BPID: '',
      Type: '',
      Full_Name: '',
      Email: '',
      Reporting_Level_RD: '',
      ReportingLevelOne: '',
      ReportingLevelTwo: '',
      Notes: ''
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
      await this.$store.dispatch('setCurrentTable', 'SalesRep');
      this.salesReps = await this.$store.dispatch('getSalesRep', '');
      this.loading = false;
      // console.log(this.salesReps);
    },

    editItem(item) {
      this.editedIndex = this.salesReps.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.salesReps.indexOf(item);
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
        await this.$store.dispatch('setCurrentTable', 'SalesRep');
        await this.$store.dispatch('updateRecord', this.editedItem);
        await this.initialize();
      } else {
        // this.salesReps.push(this.editedItem);
        // console.log('2', this.editedItem);
        this.editedItem.Id = parseInt(this.editedItem.Id);
        await this.$store.dispatch('setCurrentTable', 'SalesRep');
        await this.$store.dispatch('createRecord', this.editedItem);
        await this.initialize();
      }
      this.close();
    }
  }
};
</script>

<style scoped></style>
