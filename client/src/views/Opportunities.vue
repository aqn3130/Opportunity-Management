<template>
  <div>
    <v-container fluid class="px-5">
      <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
        <v-spacer></v-spacer>
        {{ oppTitle }}
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="rows"
        :items-per-page="perPage"
        class="elevation-1 text-no-wrap"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus'
        }"
        @click:row="onOpportunitySelect"
        :search="searchStr"
        :loading="loading"
        :style="{ cursor: 'pointer' }"
        :server-items-length="totalLeads"
        :options.sync="options"
      >
        <template v-slot:top>
          <v-toolbar flat color="grey lighten-2">
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
              @change="search"
              @click:clear="clearSearch"
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-dialog v-model="dialog" max-width="700px">
            <!--        <template v-slot:activator="{ on, attrs }">-->
            <!--          <v-btn-->
            <!--            color="#bb4d00"-->
            <!--            dark-->
            <!--            v-bind="attrs"-->
            <!--            v-on="on"-->
            <!--            small-->
            <!--            fab-->
            <!--            top-->
            <!--            right-->
            <!--            absolute-->
            <!--          >-->
            <!--            <v-icon>mdi-plus</v-icon>-->
            <!--          </v-btn>-->
            <!--        </template>-->
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="opportunityForm" lazy-validation v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Id"
                          label="Id"
                          readonly
                          disabled
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.SalesRep"
                          label="Sales Rep *"
                          :rules="nameRules"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.Type"
                          label="Type *"
                          :rules="nameRules"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.OpportunityName"
                          label="Opportunity Name *"
                          :rules="nameRules"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.CustomerName"
                          label="CustomerName Name *"
                          :rules="nameRules"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.BPID"
                          label="BPID"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.Country"
                          :items="countryOptions"
                          label="Country *"
                          :rules="nameRules"
                          required
                          @input="onCountryChange(editedItem.Country)"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.State"
                          :items="states"
                          label="State"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.ChannelType"
                          :items="channelTypeItems"
                          label="Channel Type *"
                          :rules="nameRules"
                          required
                          @input="setIndustryType(editedItem.ChannelType)"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.IndustryType"
                          :items="industryTypeItems"
                          label="Industry Type *"
                          :rules="nameRules"
                          required
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.Origin"
                          :items="originItems"
                          label="Origin *"
                          :rules="nameRules"
                          required
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.LeadID"
                          label="LeadID"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                          class="caption"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              :value="
                                editedItem.OpportunityStartDate | convertDate
                              "
                              @input="onOppStartDateChange"
                              label="Opportunity Start Date *"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              class="caption"
                              dense
                              :rules="nameRules"
                              required
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :value="
                              editedItem.OpportunityStartDate | convertDate
                            "
                            @input="onOppStartDateChange"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.Status"
                          :items="statusItems"
                          label="Status"
                          @input="onStatusChange(editedItem.Status)"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.SalesStage"
                          :items="salesStageItems"
                          label="Sales Stage *"
                          :rules="nameRules"
                          required
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.LicenseID"
                          label="License ID"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.ForecastCategory"
                          :items="forecastCategoryItems"
                          label="Forecast Category"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                          class="caption"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              :value="
                                editedItem.ExpectedCloseDate | convertDate
                              "
                              @input="onExpectedCloseDateChange"
                              label="Expected Close Date *"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              class="caption"
                              dense
                              :rules="nameRules"
                              required
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :value="editedItem.ExpectedCloseDate | convertDate"
                            @input="onExpectedCloseDateChange"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.AgentName"
                          label="Agent Name"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.Currency"
                          :items="currencyItems"
                          label="Currency"
                          dense
                          class="caption"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.GrossValue"
                          label="Gross Value"
                          dense
                          :rules="grossValueRule"
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
        </template>
        <template v-slot:item.OpportunityStartDate="{ item }">
          <span class="caption">
            {{ item.OpportunityStartDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.ExpectedCloseDate="{ item }">
          <span class="caption">
            {{ item.ExpectedCloseDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.TrialStartDate="{ item }">
          <span class="caption">
            {{ item.TrialStartDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.TrialEndDate="{ item }">
          <span class="caption">
            {{ item.TrialEndDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.ProductDemoDate="{ item }">
          <span class="caption">
            {{ item.ProductDemoDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.GrossValue="{ item }">
          <span class="caption">
            {{ item.GrossValue | formatCurrency }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <!--          <v-icon small @click="deleteItem(item)">-->
          <!--            mdi-delete-->
          <!--          </v-icon>-->
        </template>
      </v-data-table>
    </v-container>
    <v-container>
      <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
        <v-spacer></v-spacer>
        {{ productTitle }}
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        :items="products"
        :headers="productHeaders"
        class="text-no-wrap"
      >
        <template v-slot:item.LicenseStartDate="{ item }">
          <span class="caption">
            {{ item.LicenseStartDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.GrossValue="{ item }">
          <span class="caption">
            {{ item.GrossValue | formatCurrency }}
          </span>
        </template>
        <template v-slot:item.Currency="{ item }">
          <span class="caption">
            {{ item.Currency }}
          </span>
        </template>
      </v-data-table>
    </v-container>
    <v-container>
      <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
        <v-spacer></v-spacer>
        {{ noteTitle }}
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table :items="notes" :headers="notesHeader">
        <template v-slot:item.CreateDate="{ item }">
          <span class="caption">
            {{ item.CreateDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.Message="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="caption text-truncate"
                :style="{ maxWidth: '800px' }"
                v-on="on"
                v-bind="attrs"
              >
                {{ item.Message }}
              </div>
            </template>
            <span>{{ item.Message }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'Opportunities',
  data() {
    return {
      rows: [],
      OppStatus: null,
      statuses: ['All', 'In Process', 'Won', 'Closed Won', 'Closed Lost'],
      searchStr: '',
      selectedStatus: null,
      page: 0,
      perPage: 5,
      totalLeads: 0,
      options: {},
      products: [],
      notes: [],
      productTitle: 'Products',
      noteTitle: 'Notes',
      oppTitle: 'Opportunities',
      dialog: false,
      valid: true,
      editedItem: {
        Id: undefined,
        SalesRep: undefined,
        Type: undefined,
        OpportunityName: undefined,
        OpportunityStartDate: undefined
      },
      defaultItem: {
        Id: undefined,
        SalesRep: undefined,
        Type: undefined,
        OpportunityName: undefined
      },
      nameRules: [v => !!v || 'This field is required'],
      editedIndex: -1,
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      countryOptions: [],
      channelTypeItems: ['Academic', 'Corporate', 'Government'],
      industryTypeItems: [],
      originItems: ['Marketing', 'Sales Originated', 'Renewal'],
      statusItems: ['In Process', 'Won', 'Closed Won', 'Closed Lost'],
      salesStageItems: [],
      states: [],
      forecastCategoryItems: ['Pipeline', 'Committed', 'Best Case'],
      currencyItems: ['EUR', 'USD', 'GBP', 'JPY', 'AUD'],
      grossValueRule: [v => /^[0-9]+$/.test(v) || 'Numeric values only']
    };
  },
  computed: {
    headers() {
      return [
        { text: 'ID', align: 'left', value: 'Id' },
        { text: 'Sales Rep', align: 'left', value: 'SalesRep' },
        { text: 'Type', align: 'left', value: 'Type' },
        { text: 'Opportunity Name', align: 'left', value: 'OpportunityName' },
        { text: 'Customer Name', align: 'left', value: 'CustomerName' },
        { text: 'BPID', align: 'left', value: 'BPID' },
        { text: 'Country', align: 'left', value: 'Country' },
        { text: 'Channel Type', align: 'left', value: 'ChannelType' },
        { text: 'Industry Type', align: 'left', value: 'IndustryType' },
        { text: 'Origin', align: 'left', value: 'Origin' },
        { text: 'Lead ID', align: 'left', value: 'LeadID' },
        {
          text: 'Opportunity Start Date',
          align: 'left',
          value: 'OpportunityStartDate'
        },
        {
          text: 'Status',
          align: 'left',
          value: 'Status',
          filter: value => {
            if (!this.selectedStatus) return true;
            if (this.selectedStatus === this.statuses[0]) return true;
            return value === this.selectedStatus;
          }
        },
        { text: 'State', align: 'left', value: 'State' },
        { text: 'Sales Stage', align: 'left', value: 'SalesStage' },
        // { text: 'Stage Weighting', align: 'left', value: 'StageWeighting' },
        { text: 'License ID', align: 'left', value: 'LicenseID' },
        { text: 'Forecast Category', align: 'left', value: 'ForecastCategory' },
        {
          text: 'Expected Close Date',
          align: 'left',
          value: 'ExpectedCloseDate'
        },
        { text: 'Agent Name', align: 'left', value: 'AgentName' },
        { text: 'Currency', align: 'left', value: 'Currency' },
        {
          text: 'Allocation Year Rule',
          align: 'left',
          value: 'AllocationYearRule'
        },
        { text: 'Gross Value', align: 'left', value: 'GrossValue' },
        {
          text: 'Value Proposition Document',
          align: 'left',
          value: 'ValuePropositionDocument'
        },
        {
          text: 'Product Demo Status',
          align: 'left',
          value: 'ProductDemoStatus'
        },
        { text: 'Trial Status', align: 'left', value: 'TrialStatus' },
        { text: 'Trial Start Date', align: 'left', value: 'TrialStartDate' },
        {
          text: 'Number Of Recommendation Letters',
          align: 'left',
          value: 'NumberOfRecommendationLetters'
        },
        // { text: 'Customer Expansion Program', align: 'left', value: 'CustomerExpansionProgram' },
        { text: 'Product Demo Date', align: 'left', value: 'ProductDemoDate' },
        { text: 'Trial End Date', align: 'left', value: 'TrialEndDate' },
        { text: 'Actions', align: 'left', value: 'actions' }
      ];
    },
    ...mapState(['loading', 'opportunityId', 'countries', 'stateOptions']),
    productHeaders() {
      return [
        { text: 'Id', align: 'left', value: 'id' },
        { text: 'Renewal', align: 'left', value: 'typeOfBusiness' },
        { text: 'Product', align: 'left', value: 'product' },
        { text: 'Product Name', align: 'left', value: 'productName' },
        {
          text: 'Product Description',
          align: 'left',
          value: 'productDescription'
        },
        { text: 'CRY', align: 'left', value: 'cry' },
        {
          text: 'License Start Date',
          align: 'left',
          value: 'licenseStartDate'
        },
        { text: 'License End Date', align: 'left', value: 'licenseEndDate' },
        { text: 'Likelihood', align: 'left', value: 'likelihood' },
        { text: 'Agent', align: 'left', value: 'agent' },
        { text: 'Agent Discount', align: 'left', value: 'agentDiscount' },
        { text: 'Gross Value', align: 'left', value: 'grossValue' },
        { text: 'Op_Id', align: 'left', value: 'opportunity_fk' }
      ];
    },
    notesHeader() {
      return [
        { text: 'Id', align: 'left', value: 'Id' },
        { text: 'Note', align: 'left', value: 'Message' },
        { text: 'Create Date', align: 'left', value: 'CreateDate' },
        { text: 'Op_Id', align: 'left', value: 'Opportunity_fk' }
      ];
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Opportunity' : 'Edit Opportunity';
    },
    oppStartDate() {
      return this.formatDate(this.editedItem.OpportunityStartDate);
      // editedItem.OpportunityStartDate | convertDate
    }
  },
  watch: {
    options: {
      handler() {
        this.setSearchStr(this.searchStr);
        // this.setFilter(this.statuses[0]);
        this.getDataFromApi().then(data => {
          this.rows = data.items;
          this.totalLeads = data.total;
          // console.log(data);
        });
      },
      deep: true
    },
    dialog(val) {
      val || this.close();
    }
  },
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    await this.getCountries();
    await this.getStates();
  },
  filters: {
    convertDate: value => {
      if (!value) return null;
      value = value.toString();
      return moment(value)
        .utc()
        .format('YYYY-MM-DD');
    },
    formatCurrency(amount) {
      if (!amount) return '';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  },
  methods: {
    getRecords: async function() {
      return await this.$store.dispatch('getRecords', '');
    },
    ...mapMutations({
      setOppId: 'setOppId',
      setOpp: 'setOpp',
      setPage: 'setPage',
      setPerPage: 'setPerPage',
      setSearchStr: 'setSearchStr',
      setFilter: 'setFilter',
      setStateOptions: 'setStateOptions',
      setCountries: 'setCountries'
    }),
    async onOpportunitySelect(item) {
      this.searchStr = '';
      this.setSearchStr(this.searchStr);
      this.products = await this.getProducts(item.Id);
      this.notes = await this.getNotes(item.Id);
      // console.log(item);
      await this.setIndustryType(item.ChannelType);
      await this.onStatusChange(item.Status);
      await this.getStatesForCurrentCountry(item.Country, this.states);
      // console.log(item.Id, this.notes);
    },
    async onSelectChange(status) {
      let filter = '';
      if (status.trim().toLowerCase() !== 'all') {
        filter = status;
      }
      this.setFilter(filter);
      if (this.searchStr) this.setSearchStr(this.searchStr);
      this.getDataFromApi().then(data => {
        this.rows = data.items;
        this.totalLeads = data.total;
      });
    },
    getDataFromApi() {
      this.$store.dispatch('setCurrentTable', 'Opportunity');
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        this.setPage(page);
        this.setPerPage(itemsPerPage);
        let total = undefined;
        let items = undefined;
        const { opts, totalOpts } = await this.getRecords();
        total = totalOpts;
        items = opts;
        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }
        resolve({
          items,
          total
        });
      });
    },
    async search() {
      this.setSearchStr(this.searchStr);
      this.getDataFromApi().then(data => {
        this.rows = data.items;
        this.totalLeads = data.total;
      });
    },
    clearSearch() {
      this.searchStr = '';
      this.search();
    },
    getProducts: async function(opp_id) {
      const productItems = [];
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      const data = await this.$store.dispatch('getRecords', opp_id);
      Object.keys(data).forEach(key => {
        const product = {
          opportunity_fk: data[key].Opportunity_fk,
          id: data[key].Id,
          cry: data[key].CRY,
          typeOfBusiness: data[key].TypeOfBusiness,
          product: data[key].Product,
          productName: data[key].ProductName,
          productDescription: data[key].ProductDescription,
          licenseStartDate: this.formatDate(data[key].LicenseStartDate),
          licenseEndDate: this.formatDate(data[key].LicenseEndDate),
          likelihood: data[key].Likelihood,
          agent: data[key].Agent,
          agentDiscount: data[key].AgentDiscount,
          grossValue: this.formatCurrency(data[key].GrossValue)
        };
        productItems.push(product);
      });
      return productItems;
    },
    async getNotes(opId) {
      await this.$store.dispatch('setCurrentTable', 'Note');
      return await this.$store.dispatch('getRecords', opId);
    },
    formatDate(date) {
      if (!date) return null;
      date = date.toString();
      const format = 'YYYY-MM-DD';
      return moment(date)
        .utc()
        .format(format);
    },
    formatCurrency(amount) {
      if (!amount) return '';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    validate() {
      if (this.$refs.opportunityForm.validate()) {
        this.save();
      }
    },
    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    formatDateBeforeSave(date) {
      if (!date) return null;
      date = date.toString();
      const format = 'YYYY-MM-DD HH:mm:ss';
      return moment(date)
        .utc()
        .format(format);
    },
    async save() {
      if (this.editedIndex > -1) {
        const id = this.editedItem.Id;
        delete this.editedItem.Id;
        this.editedItem.id = id;
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        this.editedItem.OpportunityStartDate = this.formatDateBeforeSave(
          this.editedItem.OpportunityStartDate
        );
        this.editedItem.ExpectedCloseDate = this.formatDateBeforeSave(
          this.editedItem.ExpectedCloseDate
        );
        this.editedItem.ProductDemoDate = this.formatDateBeforeSave(
          this.editedItem.ProductDemoDate
        );
        this.editedItem.TrialEndDate = this.formatDateBeforeSave(
          this.editedItem.TrialEndDate
        );
        this.editedItem.TrialStartDate = this.formatDateBeforeSave(
          this.editedItem.TrialStartDate
        );
        this.editedItem.CreationDate = this.formatDateBeforeSave(
          this.editedItem.CreationDate
        );
        await this.$store.dispatch('updateRecord', this.editedItem);
        this.clearSearch();
      } else {
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        delete this.editedItem.Id;
        await this.$store.dispatch('createRecord', this.editedItem);
      }
      this.close();
    },
    onOppStartDateChange(value) {
      this.editedItem.OpportunityStartDate = value;
      this.menu = false;
    },
    onExpectedCloseDateChange(value) {
      this.editedItem.ExpectedCloseDate = value;
      this.menu2 = false;
    },
    async setIndustryType(channelType) {
      this.industryTypeItems = [];
      await this.$store.dispatch('setCurrentTable', 'Industry');
      const industries = await this.$store.dispatch('getIndustry', '');
      Object.keys(industries).forEach((value, index) => {
        if (
          industries[index] &&
          channelType.toLowerCase().trim() ===
            industries[index].Channel.toLowerCase().trim()
        ) {
          this.industryTypeItems.push(industries[index].Industry);
        }
      });
    },
    onStatusChange(status) {
      const tempArray = [
        '1 - Prospect / Lead',
        '2 - Pre-Qualification',
        '3 - Qualified',
        '4 - Needs Assessment',
        '5 - Product Evaluation',
        '6 - Proposal Sent',
        '7 - Negotiating Commercial',
        '8 - Negotiating LC/Legal',
        '9 - Final Terms Accepted',
        '10 - License Delivered to Customer'
      ];
      const won = ['11 - License Agreement Signed'];
      const closedWon = ['14 - Customer Invoiced'];
      this.lostOpportunityReason = null;
      if (status === 'Won') {
        this.salesStageItems = won;
        this.salesStage = this.salesStageItems[0];
      } else if (status === 'Closed Won') {
        this.salesStageItems = closedWon;
        this.salesStage = this.salesStageItems[0];
      } else if (status === 'Closed Lost') {
        this.salesStageItems = tempArray;
        // this.salesStage = null;
      } else {
        this.salesStageItems = tempArray;
      }
    },
    async getStatesForCurrentCountry(country, states) {
      this.states = [];
      Object.keys(states).forEach((value, index) => {
        if (
          states[index] &&
          states[index].Country &&
          country &&
          country.toLowerCase().trim() ===
            states[index].Country.toLowerCase().trim()
        ) {
          this.states.push(states[index].Name);
        }
      });
      if (this.states.length === 0) {
        this.states.push('N/A');
        this.state = this.states[0];
      }
    },
    async onCountryChange(country) {
      this.state = null;
      await this.getStatesForCurrentCountry(country, this.stateOptions);
    },
    async getStates() {
      if (this.stateOptions.length) {
        this.states = this.stateOptions;
      } else {
        await this.$store.dispatch('setCurrentTable', 'States');
        const states = await this.$store.dispatch('getStates', '');
        this.setStateOptions(states);
      }
    },
    getCountries: async function() {
      if (this.countries.length) {
        this.countryOptions = this.countries;
      } else {
        // await this.$store.dispatch(
        //   'setCurrentTable',
        //   'Country_Region_Territory'
        // );
        const countries = await this.$store.dispatch(
          'getCountryRegionTerritory',
          ''
        );
        Object.keys(countries).forEach((value, index) => {
          if (countries[index])
            this.countryOptions.push(countries[index].Country);
        });
        this.setCountries(this.countryOptions);
      }
    }
  }
};
</script>

<style scoped></style>
