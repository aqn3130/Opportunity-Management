<template>
  <v-container fluid>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2">
      <v-spacer></v-spacer>
      {{ title }}
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      tile
      color="#ffffff"
      light
      :style="{ paddingLeft: '100px', paddingRight: '100px' }"
    >
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row style="padding: 15px 20px 25px 20px">
          <v-col md="6">
            <v-text-field
              v-model="salesRep"
              :rules="nameRules"
              label="Sales Rep"
              required
              disabled
            ></v-text-field>
            <v-text-field
              v-model="salesRepType"
              :rules="nameRules"
              label="Type"
              required
              disabled
            ></v-text-field>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Opportunity Start Date"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="opportunityName"
              :rules="nameRules"
              label="Opportunity Name *"
              required
            ></v-text-field>
            <v-text-field
              v-model="customerName"
              :rules="nameRules"
              label="Customer Name *"
              required
            ></v-text-field>
            <v-text-field
              v-model="bpId"
              :rules="bpIdRules"
              label="BP ID"
              v-if="bpId"
            ></v-text-field>
            <v-text-field v-model="bpId" label="BP ID" v-else></v-text-field>
            <v-text-field
              v-model="memberOfConsortia"
              :rules="nameRules"
              label="Member Of Consortia *"
            ></v-text-field>
            <v-select
              v-model="country"
              :items="countryItems"
              :rules="[v => !!v || 'This field is required']"
              label="Country *"
              required
              @input="getStates(country)"
            ></v-select>
            <v-select
              v-model="state"
              :items="states"
              label="State"
              :disabled="state === 'N/A'"
            ></v-select>
            <v-select
              v-model="channelType"
              :rules="nameRules"
              label="Channel Type *"
              :items="channelTypeItems"
              @input="setIndustryType(channelType)"
            ></v-select>
            <v-select
              v-model="industryType"
              :rules="nameRules"
              label="Industry/Institution Type *"
              :items="industryTypeItems"
            ></v-select>
          </v-col>
          <v-col md="6">
            <v-select
              v-model="origin"
              :items="originItems"
              :rules="[v => !!v || 'This field is required']"
              label="Origin *"
              required
            ></v-select>
            <v-text-field
              v-model="leadId"
              label="Lead ID"
              :disabled="origin !== 'Marketing'"
            ></v-text-field>
            <v-select
              v-model="status"
              :items="statusItems"
              label="Status"
              @input="onStatusChange(status)"
            ></v-select>
            <v-select
              v-model="salesStage"
              :items="salesStageItems"
              label="Sales Stage *"
              :rules="nameRules"
            ></v-select>
            <v-select
              v-model="lostOpportunityReason"
              :items="lostOpportunityReasonItems"
              label="Lost Opportunity Reason"
              :disabled="status !== 'Closed Lost'"
            ></v-select>

            <v-text-field
              v-model="licenseId"
              :rules="licenseIdRules"
              label="License ID"
              required
              v-if="licenseId"
            ></v-text-field>
            <v-text-field
              v-model="licenseId"
              label="License ID"
              v-else
            ></v-text-field>

            <v-select
              v-model="forecastCategory"
              :items="forecastCategoryItems"
              label="Forecast Category"
            ></v-select>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="expectedCloseDate"
                  label="Expected Close Date *"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="nameRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="expectedCloseDate"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field v-model="agentName" label="Agent Name"></v-text-field>
            <v-select
              v-model="currency"
              :items="currencyItems"
              label="Currency *"
              :rules="nameRules"
              required
            ></v-select>

            <v-btn
              :disabled="!valid"
              color="#607D8B"
              class="mr-4 mt-5"
              @click="validate"
              small
              :loading="newOppLoading"
              v-if="!valid"
            >
              Save & Close
            </v-btn>
            <v-btn
              color="#607D8B"
              class="mr-4 mt-5"
              @click="validate"
              small
              :loading="newOppLoading"
              v-else
              dark
            >
              Save & Close
            </v-btn>

            <v-btn
              :disabled="!valid"
              color="#607D8B"
              class="mr-4 mt-5"
              @click="validate"
              small
              v-if="!valid"
              :loading="newOppLoading"
            >
              Save & Edit
            </v-btn>
            <v-btn
              v-else
              color="#607D8B"
              class="mr-4 mt-5"
              @click="validate"
              dark
              small
              :loading="newOppLoading"
            >
              Save & Edit
            </v-btn>

            <v-btn
              color="#607D8B"
              class="mr-4 mt-5"
              @click="reset"
              dark
              small
              elevation="0"
              :loading="newOppLoading"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2">
      <v-spacer></v-spacer>
      Products
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile>
      <v-form ref="productForm" v-model="productValid" lazy-validation>
        <v-list dense>
          <v-list-item-group v-model="productItem" color="primary">
            <v-list-item v-for="(item, i) in productItems" :key="i" two-line>
              <v-list-item-content class="mr-2">
                <v-select
                  :items="item.cryItems"
                  v-model="item.cry"
                  label="CRY"
                  :rules="nameRules"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-select
                  :items="item.TOBItems"
                  v-model="item.tob"
                  label="Type of Business"
                  :rules="nameRules"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-select
                  :items="item.products"
                  v-model="item.productName"
                  label="Product Name"
                  :rules="nameRules"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-text-field
                  v-model="item.productDescription"
                  label="Product Description"
                ></v-text-field>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-menu
                  v-model="menu3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.licenseStartDate"
                      label="License Start Date"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="nameRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.licenseStartDate"
                    @input="menu3 = false"
                  ></v-date-picker>
                </v-menu>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-menu
                  v-model="menu4"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.licenseEndDate"
                      label="License End Date"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="nameRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.licenseEndDate"
                    @input="menu4 = false"
                  ></v-date-picker>
                </v-menu>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-select
                  :items="likelihood"
                  v-model="item.likelihood"
                  label="Likelihood"
                  :rules="nameRules"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="">
                <v-checkbox v-model="item.agent" label="Agent"></v-checkbox>
              </v-list-item-content>
              <v-list-item-content class="ml-2 mr-2">
                <v-select
                  :items="agentDiscountOptions"
                  v-model="item.agentDiscount"
                  label="Agent Discount"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="ml-2">
                <v-text-field
                  v-model="item.grossValue"
                  label="Gross Value"
                  :rules="nameRules"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-form>
    </v-card>
    <v-card>
      <v-btn block @click="addProduct" class="mt-1">+ Add Product</v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'EditOpp',
  data: () => ({
    title: 'Edit Opportunity',
    valid: true,
    productValid: true,
    name: '',
    nameRules: [v => !!v || 'This field is required'],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    bpIdRules: [
      v => (v && v.length === 10) || 'This field must be 10 numeric values',
      v => /^[0-9]+$/.test(v) || 'Numeric values only'
    ],
    licenseIdRules: [
      v => (v && v.length === 5) || 'This field must be 5 numeric values',
      v => /^[0-9]+$/.test(v) || 'Numeric values only'
    ],
    select: null,
    countryItems: [],
    checkbox: false,
    salesRepType: null,
    date: new Date().toISOString().substr(0, 10),
    expectedCloseDate: null,
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    opportunityName: null,
    customerName: null,
    bpId: null,
    memberOfConsortia: null,
    country: null,
    states: [],
    state: null,
    channelType: null,
    industryType: null,
    channelTypeItems: ['Academic', 'Corporate', 'Government'],
    industryTypeItems: [],
    origin: null,
    originItems: ['Marketing', 'Sales Originated', 'Renewal'],
    statusItems: ['In Process', 'Won', 'Closed Won', 'Closed Lost'],
    status: 'In Process',
    salesStageItems: [],
    salesStage: null,
    leadId: null,
    lostOpportunityReason: null,
    lostOpportunityReasonItems: [
      'Already License a Competing Product',
      'Cost / Price Too High',
      'Budget Constraints',
      'No Demand',
      'Not Interested',
      'Opportunity merged or duplicated',
      'Purchased via another channel',
      'Sale to be handled by SCSC',
      'Wrong Timing',
      'Other'
    ],
    licenseId: null,
    forecastCategory: null,
    forecastCategoryItems: ['Pipeline', 'Committed', 'Best Case'],
    agentName: null,
    currency: null,
    currencyItems: ['EUR', 'USD', 'GBP', 'JPY', 'AUD'],
    newOppLoading: false,
    salesRep: null,
    productItem: 1,
    cryOptions: [
      '<1997',
      '<2005',
      '2005',
      '2006',
      '2007',
      '2008',
      '2009',
      '2010',
      '2011',
      '2012',
      '2013',
      '2014',
      '2015',
      '2016',
      '2017',
      '2018',
      '<2019',
      '2019',
      '<2020',
      '2020',
      '2021'
    ],
    productItems: [],
    typeOfBusinessOptions: ['New', 'Recruiting', 'Renewal'],
    products: [],
    licenseStartDate: null,
    licenseEndDate: null,
    likelihood: [
      '0% - Lost',
      '10% - Low Chance of Winning',
      '20% - Possible but unlikely',
      '40% - Interest, but no commitment',
      '60% - Likely',
      '80% - Very Likely',
      '100% - Confident it will close]'
    ],
    agent: false,
    agentDiscountOptions: [
      1,
      1.5,
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
      5,
      6,
      7,
      7.5,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ]
  }),
  methods: {
    getFormData() {
      const data_map = new Map();
      for (let i in this.$refs.form._data.inputs) {
        let formLable = this.$refs.form._data.inputs[i].label
          .replace('*', '')
          .replace(/ /g, '')
          .trim();
        if (formLable === 'Industry/InstitutionType')
          formLable = 'IndustryType';
        let formValue = this.$refs.form._data.inputs[i].value;
        data_map.set(formLable, formValue);
      }
      return Object.fromEntries(data_map);
    },
    async saveNewOpportunity(newOpportunity) {
      // console.log(newOpportunity);
      this.newOppLoading = true;
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      await this.$store.dispatch('createRecord', newOpportunity);
      this.$toast.open({
        message: 'New Opportunity Created',
        type: 'success',
        duration: 2000,
        dismissible: true,
        onClose: () => {
          this.$router.push({ name: 'Dashboard' });
          this.newOppLoading = false;
        }
      });
    },
    async validate() {
      if (this.$refs.form.validate()) {
        await this.saveNewOpportunity(this.getFormData());
      }
    },
    reset() {
      // this.$refs.form.reset()
      // this.$refs.form.resetValidation()
      this.$router.push({ name: 'Dashboard' });
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async getStates(country) {
      this.states = [];
      this.state = null;
      await this.$store.dispatch('setCurrentTable', 'States');
      const states = await this.$store.dispatch('getRecords', '');
      Object.keys(states).forEach((value, index) => {
        if (
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
    async setIndustryType(channelType) {
      this.industryTypeItems = [];
      await this.$store.dispatch('setCurrentTable', 'Industry');
      const industries = await this.$store.dispatch('getRecords', '');
      Object.keys(industries).forEach((value, index) => {
        if (
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
    getProducts: async function() {
      const data = await this.$store.dispatch('getRecords', this.opportunityId);
      Object.keys(data).forEach(key => {
        const product = {
          cryItems: this.cryOptions,
          TOBItems: this.typeOfBusinessOptions,
          cry: data[key].CRY,
          tob: data[key].TypeOfBusiness,
          products: this.products,
          productName: data[key].ProductName,
          productDescription: data[key].ProductDescription,
          licenseStartDate: this.formatDate(data[key].LicenseStartDate),
          licenseEndDate: this.formatDate(data[key].LicenseEndDate),
          likelihood: data[key].Likelihood,
          agent: data[key].Agent,
          agentDiscount: data[key].AgentDiscount,
          grossValue: data[key].GrossValue
        };
        this.productItems.push(product);
        // console.log('products', product);
      });
    },
    formatDate(date) {
      if (!date) return '';
      date = date.toString();
      const format = 'YYYY-MM-DD';
      return moment(date)
        .utc()
        .format(format);
    },
    addProduct() {
      const product = {
        cryItems: this.cryOptions,
        TOBItems: this.typeOfBusinessOptions,
        cry: null,
        tob: null,
        products: this.products,
        productName: null,
        productDescription: null,
        licenseStartDate: null,
        licenseEndDate: null,
        likelihood: null,
        agent: null,
        agentDiscount: null,
        grossValue: null
      };
      if ( this.productItems[this.productItems.length - 1].cry === null ) {
        if (this.$refs.productForm.validate()){
          this.productItems.push(product);
        }
      } else {
        this.productItems.push(product);
      }
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState(['loading', 'opportunityId', 'opportunity'])
  },
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    await this.getProducts();
    await this.$store.dispatch('setCurrentTable', 'Products');
    const data = await this.$store.dispatch('getRecords', '');
    Object.keys(data).forEach(key => {
      this.products.push(data[key].Category_Description);
    });
    // this.products = data;
    this.salesRepType = this.opportunity.Type;
    this.salesRep = this.opportunity.SalesRep;
    this.opportunityName = this.opportunity.OpportunityName;
    this.customerName = this.opportunity.CustomerName;
    this.bpId = this.opportunity.BPID;
    this.memberOfConsortia = this.opportunity.MemberOfConsortia;
    this.country = this.opportunity.Country;
    this.state = this.opportunity.State;
    this.channelType = this.opportunity.ChannelType;
    await this.setIndustryType(this.channelType);
    this.industryType = this.opportunity.IndustryType;
    this.origin = this.opportunity.Origin;
    this.leadId = this.opportunity.LeadID;
    this.status = this.opportunity.Status;
    this.onStatusChange(this.status);
    this.salesStage = this.opportunity.SalesStage;
    this.lostOpportunityReason = this.opportunity.LostOpportunityReason;
    this.licenseId = this.opportunity.LicenseID;
    this.forecastCategory = this.opportunity.ForecastCategory;
    this.agentName = this.opportunity.AgentName;
    this.currency = this.opportunity.Currency;
    this.expectedCloseDate = this.formatDate(
      this.opportunity.ExpectedCloseDate
    );
    await this.$store.dispatch('setCurrentTable', 'Country_Region_Territory');
    const countries = await this.$store.dispatch('getRecords', '');
    Object.keys(countries).forEach((value, index) => {
      this.countryItems.push(countries[index].Country);
    });
  }
};
</script>
