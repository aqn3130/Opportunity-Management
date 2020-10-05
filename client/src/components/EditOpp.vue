<template>
  <v-container fluid>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
      <v-spacer></v-spacer>
      {{ title }}
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      tile
      color="#ffffff"
      light
      :style="{ paddingLeft: '200px', paddingRight: '200px' }"
      id="opp_container"
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
              class="body-2"
            ></v-text-field>
            <v-text-field
              v-model="salesRepType"
              :rules="nameRules"
              label="Type"
              required
              disabled
              class="body-2"
            ></v-text-field>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
              class="body-2"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Opportunity Start Date"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="body-2"
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
              class="body-2"
            ></v-text-field>
            <v-text-field
              v-model="customerName"
              :rules="nameRules"
              label="Customer Name *"
              required
              class="body-2"
            ></v-text-field>
            <v-text-field
              v-model="bpId"
              :rules="bpIdRules"
              label="BP ID"
              v-if="bpId"
              class="body-2"
            ></v-text-field>
            <v-text-field v-model="bpId" label="BP ID" v-else></v-text-field>
            <v-text-field
              v-model="memberOfConsortia"
              :rules="nameRules"
              label="Member Of Consortia *"
              class="body-2"
            ></v-text-field>
            <v-select
              v-model="country"
              :items="countryItems"
              :rules="[v => !!v || 'This field is required']"
              label="Country *"
              required
              @input="getStates(country)"
              class="body-2"
            ></v-select>
            <v-select
              v-model="state"
              :items="states"
              label="State"
              :disabled="state === 'N/A'"
              class="body-2"
            ></v-select>
            <v-select
              v-model="channelType"
              :rules="nameRules"
              label="Channel Type *"
              :items="channelTypeItems"
              @input="setIndustryType(channelType)"
              class="body-2"
            ></v-select>
            <v-select
              v-model="industryType"
              :rules="nameRules"
              label="Industry/Institution Type *"
              :items="industryTypeItems"
              class="body-2"
            ></v-select>
          </v-col>
          <v-col md="6">
            <v-select
              v-model="origin"
              :items="originItems"
              :rules="[v => !!v || 'This field is required']"
              label="Origin *"
              required
              class="body-2"
            ></v-select>
            <v-text-field
              v-model="leadId"
              label="Lead ID"
              :disabled="origin !== 'Marketing'"
              class="body-2"
            ></v-text-field>
            <v-select
              v-model="status"
              :items="statusItems"
              label="Status"
              @input="onStatusChange(status)"
              class="body-2"
            ></v-select>
            <v-select
              v-model="salesStage"
              :items="salesStageItems"
              label="Sales Stage *"
              :rules="nameRules"
              class="body-2"
            ></v-select>
            <v-select
              v-model="lostOpportunityReason"
              :items="lostOpportunityReasonItems"
              label="Lost Opportunity Reason"
              :disabled="status !== 'Closed Lost'"
              class="body-2"
            ></v-select>

            <v-text-field
              v-model="licenseId"
              :rules="licenseIdRules"
              label="License ID"
              required
              v-if="licenseId"
              class="body-2"
            ></v-text-field>
            <v-text-field
              v-model="licenseId"
              label="License ID"
              v-else
              class="body-2"
            ></v-text-field>

            <v-select
              v-model="forecastCategory"
              :items="forecastCategoryItems"
              label="Forecast Category"
              class="body-2"
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
                  class="body-2"
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
              class="body-2"
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
              Save
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
              Save
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
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
      <v-spacer></v-spacer>
      Products
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile>
      <v-form ref="productForm" v-model="productValid" lazy-validation>
        <v-list dense>
          <v-list-item-group v-model="productItem" color="primary">
            <v-list-item v-for="(item, i) in productItems" :key="i" two-line>
              <v-list-item-content class="">
                <v-select
                  :items="item.cryItems"
                  v-model="item.cry"
                  label="CRY"
                  :rules="nameRules"
                  class="body-2"
                  :style="{ maxWidth: '80px' }"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="mr-2 ml-n5">
                <v-select
                  :items="item.TOBItems"
                  v-model="item.typeOfBusiness"
                  label="Type of Business"
                  :rules="nameRules"
                  class="body-2"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="mr-2">
                <v-select
                  :items="item.products"
                  v-model="item.productName"
                  label="Product Name"
                  :rules="nameRules"
                  class="body-2"
                  @input="onProductNameChange"
                ></v-select>
              </v-list-item-content>
              <div class="ml-2">
                <span class="caption">License Start Date</span>
                <Datepicker
                  class="mb-5 vdp-datepicker mr-10"
                  placeholder="Select Date"
                  v-model="item.licenseStartDate"
                  :format="dateFormat"
                ></Datepicker>
              </div>
              <div class="ml-n8">
                <span class="caption">License End Date</span>
                <Datepicker
                  class="mb-5 vdp-datepicker"
                  placeholder="Select Date"
                  v-model="item.licenseEndDate"
                  :format="dateFormat"
                ></Datepicker>
              </div>
              <v-list-item-content class="mr-2 ml-3">
                <v-select
                  :items="likelihood"
                  v-model="item.likelihood"
                  label="Likelihood"
                  :rules="nameRules"
                  class="body-2"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content>
                <v-checkbox
                  v-model="item.agent"
                  label="Agent"
                  dense
                ></v-checkbox>
              </v-list-item-content>
              <v-list-item-content class="ml-n8">
                <v-select
                  :items="agentDiscountOptions"
                  v-model="item.agentDiscount"
                  label="Agent Discount"
                  class="body-2"
                ></v-select>
              </v-list-item-content>
              <v-list-item-content class="ml-2">
                <v-text-field
                  v-model="item.grossValue"
                  label="Gross Value"
                  :rules="nameRules"
                  class="body-2"
                ></v-text-field>
              </v-list-item-content>
              <v-btn icon small @click="deleteProduct(item)"
                ><v-icon small>delete</v-icon></v-btn
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-form>
    </v-card>
    <v-card>
      <v-btn block @click="addProduct" class="mt-1">+ Add Product</v-btn>
    </v-card>
    <v-dialog v-model="deleteProductDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="grey lighten-3">
          Product Deletion
        </v-card-title>
        <v-card-text class="py-5">
          You are about to delete selected product, are you sure?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteExistingProduct">Delete</v-btn>
          <v-btn text @click="deleteProductDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
export default {
  components: {
    Datepicker
  },
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
    ],
    dateFormat: 'yyyy-MM-dd',
    deleteProductDialog: false,
    toBeDeletedProductId: null
  }),
  methods: {
    ...mapMutations({
      setPage: 'setPage',
      setPerPage: 'setPerPage',
      setTab: 'setTab',
      setProducts: 'setProducts',
      setOpp: 'setOpp'
    }),
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
      data_map.set('id', this.opportunityId);
      return Object.fromEntries(data_map);
    },
    async updateOpportunity(currentOpportunity) {
      // console.log(currentOpportunity);
      this.newOppLoading = true;
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      try {
        await this.$store.dispatch('updateRecord', currentOpportunity);
        await this.updateProduct();
        this.$toast.open({
          message: 'Opportunity Updated',
          type: 'success',
          duration: 2000,
          dismissible: true,
          position: 'bottom',
          onClose: () => {
            this.$router.push({ name: 'Dashboard' });
            this.newOppLoading = false;
          }
        });
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: 'Update failed please contact system Admin',
          type: 'error',
          duration: 3000,
          dismissible: true,
          position: 'bottom',
          onClose: () => {
            this.$router.push({ name: 'Dashboard' });
            this.newOppLoading = false;
          }
        });
      }
    },
    async updateProduct() {
      await this.$store.dispatch('setCurrentTable', 'Product');
      for (const key of Object.keys(this.productItems)) {
        delete this.productItems[key].cryItems;
        delete this.productItems[key].products;
        delete this.productItems[key].TOBItems;
        // console.log(this.productItems[key]);
        if (!this.productItems[key].id) {
          if (this.productItems[key].typeOfBusiness === 'Renewal')
            this.productItems[key].renewal = 1;
          this.productItems[key].licenseStartDate = this.formatDate(
            this.productItems[key].licenseStartDate
          );
          this.productItems[key].licenseEndDate = this.formatDate(
            this.productItems[key].licenseEndDate
          );
          await this.$store.dispatch('createRecord', this.productItems[key]);
          // delete this.productItems[key];
        }
        if (this.productItems[key].id)
          await this.$store.dispatch('updateRecord', this.productItems[key]);
      }
    },
    async validate() {
      if (this.$refs.form.validate()) {
        await this.updateOpportunity(this.getFormData());
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
          states[index] &&
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
    getProducts: async function() {
      this.productItems = [];
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      const data = await this.$store.dispatch('getRecords', this.opportunityId);
      Object.keys(data).forEach(key => {
        const product = {
          opportunity_fk: data[key].Opportunity_fk,
          id: data[key].Id,
          cryItems: this.cryOptions,
          TOBItems: this.typeOfBusinessOptions,
          cry: data[key].CRY,
          typeOfBusiness: data[key].TypeOfBusiness,
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
      });
      // this.setProducts(this.temp);
      // console.log('productItems', this.productItems);
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
        typeOfBusiness: null,
        products: this.products,
        productName: null,
        productDescription: null,
        licenseStartDate: null,
        licenseEndDate: null,
        likelihood: null,
        agent: 0,
        agentDiscount: null,
        grossValue: null,
        renewal: 0,
        opportunity_fk: parseInt(this.opportunityId)
      };
      if (
        this.productItems[this.productItems.length - 1] &&
        this.productItems[this.productItems.length - 1].cry === null
      ) {
        if (this.$refs.productForm.validate()) {
          this.productItems.push(product);
        }
      } else {
        this.productItems.push(product);
      }
      console.log(this.productItems);
    },
    deleteProduct(item) {
      // console.log(item);
      if (this.productItems[this.productItems.length - 1].cry === null) {
        this.productItems.splice(this.productItems.length - 1);
      } else {
        this.toBeDeletedProductId = item.id;
        this.deleteProductDialog = true;
      }
    },
    onProductNameChange(tob) {
      // console.log(tob);
    },
    deleteExistingProduct() {
      this.$store.dispatch('setCurrentTable', 'Product');
      try {
        this.$store.dispatch('deleteRecord', this.toBeDeletedProductId);
        this.deleteProductDialog = false;
        this.getProducts();
        this.$toast.open({
          message: 'Product Deleted',
          type: 'success',
          duration: 2000,
          dismissible: true,
          position: 'bottom'
          // onClose: () => {
          // this.getProducts();
          // }
        });
      } catch (e) {
        this.deleteProductDialog = false;
        this.$toast.open({
          message: 'Delete failed please contact system Admin',
          type: 'error',
          duration: 3000,
          dismissible: true,
          position: 'bottom'
          // onClose: () => {
          //   this.$router.push({ name: 'Dashboard' });
          //   this.newOppLoading = false;
          // }
        });
      }
    },
    async init() {
      if (this.opportunityId) {
        this.setPage('');
        this.setTab('opp');
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        await this.getProducts();
        await this.$store.dispatch('setCurrentTable', 'Products');
        const data = await this.$store.dispatch('getRecords', '');
        Object.keys(data).forEach(key => {
          this.products.push(data[key].Category_Description);
        });
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
        await this.$store.dispatch(
          'setCurrentTable',
          'Country_Region_Territory'
        );
        const countries = await this.$store.dispatch('getRecords', '');
        Object.keys(countries).forEach((value, index) => {
          if (countries[index])
            this.countryItems.push(countries[index].Country);
        });
      } else {
        await this.$router.push({ name: 'Dashboard' });
      }
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState(['loading', 'opportunityId', 'opportunity'])
  },
  async created() {
    try {
      await this.init();
    } catch (e) {
      console.log(e);
      await this.$router.push({name: 'Dashboard'});
    }
  }
};
</script>
<style>
.vdp-datepicker input {
  width: 110px;
}
</style>
