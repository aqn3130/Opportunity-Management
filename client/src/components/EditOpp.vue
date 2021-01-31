<template>
  <v-container fluid id="oppEditContainer">
    <v-toolbar color="#455A64" height="30" class="overline" dark>
      <v-spacer></v-spacer>
      {{ title }}
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      color=""
      id="opp_container"
      outlined
      class=""
      :style="{
        border: '1px solid #455A64',
        paddingLeft: '150px',
        paddingRight: '150px'
      }"
      tile
    >
      <v-form ref="form" v-model="valid" lazy-validation id="editOppForm">
        <v-row style="padding: 20px 20px 25px 20px">
          <v-col md="6">
            <v-text-field
              v-model="salesRep"
              :rules="nameRules"
              label="Sales Rep"
              required
              disabled
              class="caption"
              dense
            ></v-text-field>
            <v-text-field
              v-model="salesRepType"
              :rules="nameRules"
              label="Type"
              required
              disabled
              class="caption"
              dense
            ></v-text-field>
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
                  v-model="opportunityStartDate"
                  label="Opportunity Start Date"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="caption"
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="opportunityStartDate"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="opportunityName"
              :rules="nameRules"
              label="Opportunity Name *"
              required
              class="caption"
              dense
            ></v-text-field>
            <v-text-field
              v-model="customerName"
              :rules="nameRules"
              label="Customer Name *"
              required
              class="caption"
              dense
            ></v-text-field>
            <v-text-field
              v-model="bpId"
              :rules="bpIdRules"
              label="BP ID"
              v-if="bpId"
              class="caption"
              dense
            ></v-text-field>
            <v-text-field v-model="bpId" label="BP ID" v-else></v-text-field>
            <v-text-field
              v-model="memberOfConsortia"
              label="Member Of Consortia"
              class="caption"
              dense
            ></v-text-field>
            <v-select
              v-model="country"
              :items="countryItems"
              :rules="[v => !!v || 'This field is required']"
              label="Country *"
              required
              @input="onCountryChange(country)"
              class="caption"
              dense
            ></v-select>
            <v-select
              v-model="state"
              :items="states"
              label="State"
              class="caption"
              dense
              :disabled="isState"
            ></v-select>
            <v-select
              v-model="channelType"
              :rules="nameRules"
              label="Channel Type *"
              :items="channelTypeItems"
              @input="setIndustryType(channelType)"
              class="caption"
              dense
            ></v-select>
            <v-select
              v-model="industryType"
              :rules="nameRules"
              label="Industry/Institution Type *"
              :items="industryTypeItems"
              class="caption"
              dense
            ></v-select>
          </v-col>
          <v-col md="6">
            <v-select
              v-model="origin"
              :items="originItems"
              :rules="[v => !!v || 'This field is required']"
              label="Origin *"
              required
              class="caption"
              dense
            ></v-select>
            <v-text-field
              v-model="leadId"
              label="Lead ID"
              :disabled="origin !== 'Marketing'"
              class="caption"
              dense
            ></v-text-field>
            <v-select
              v-model="status"
              :items="statusItems"
              label="Status"
              @input="onStatusChange(status)"
              class="caption"
              dense
            ></v-select>
            <v-select
              v-model="salesStage"
              :items="salesStageItems"
              label="Sales Stage *"
              :rules="nameRules"
              class="caption"
              dense
            ></v-select>
            <v-select
              v-model="lostOpportunityReason"
              :items="lostOpportunityReasonItems"
              label="Lost Opportunity Reason"
              :disabled="status !== 'Closed Lost'"
              class="caption"
              dense
            ></v-select>

            <v-text-field
              v-model="licenseId"
              :rules="licenseIdRules"
              label="License ID"
              required
              v-if="licenseId"
              class="caption"
              dense
            ></v-text-field>
            <v-text-field
              v-model="licenseId"
              label="License ID"
              v-else
              class="caption"
              dense
            ></v-text-field>

            <v-select
              v-model="forecastCategory"
              :items="forecastCategoryItems"
              label="Forecast Category"
              class="caption"
              dense
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
                  class="caption"
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="expectedCloseDate"
                @input="onExpectedCloseDateChange"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="agentName"
              label="Agent Name"
              class="caption"
              dense
            ></v-text-field>
            <v-select
              v-model="currency"
              :items="currencyItems"
              label="Currency *"
              :rules="nameRules"
              required
              class="caption"
              dense
            ></v-select>

            <v-btn
              :disabled="!valid"
              color="#607D8B"
              class="mr-4 mt-1"
              @click="validate"
              small
              :loading="newOppLoading"
              v-if="!valid"
            >
              Save
            </v-btn>
            <v-btn
              color="#607D8B"
              class="mr-4 mt-1"
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
              class="mt-1"
              @click="reset"
              small
              :loading="newOppLoading"
              dark
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-toolbar color="#455A64" height="30" class="overline mt-n7" dark>
      <v-spacer></v-spacer>
      Products
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      class="caption"
      :style="{ border: '1px solid #455A64' }"
      v-if="productItems.length"
      tile
    >
      <v-flex class="d-flex overflow-auto">
        <v-form
          ref="productForm"
          v-model="productValid"
          lazy-validation
          class="d-flex align-content-space-between d-block"
        >
          <v-list dense>
            <v-list-item-group v-model="productItem" color="primary">
              <div v-for="(item, i) in productItems" :key="i">
                <v-list-item two-line :style="{ border: '1px dotted #455A64' }">
                  <v-list-item-content class="mr-2">
                    <v-select
                      :items="item.cryItems"
                      v-model="item.cry"
                      label="CRY"
                      :rules="nameRules"
                      class="caption"
                      dense
                    ></v-select>
                  </v-list-item-content>
                  <v-list-item-content class="mr-2">
                    <v-select
                      :items="item.TOBItems"
                      v-model="item.typeOfBusiness"
                      label="Type of Business"
                      :rules="nameRules"
                      class="caption"
                      dense
                    ></v-select>
                  </v-list-item-content>
                  <v-list-item-content class="mr-2">
                    <v-select
                      :items="item.products"
                      v-model="item.productName"
                      label="Product Name"
                      :rules="nameRules"
                      class="caption"
                      @input="onProductNameChange"
                      dense
                    ></v-select>
                  </v-list-item-content>
                  <v-list-item-content class="mr-2">
                    <v-text-field
                      v-model="item.productDescription"
                      label="Product Description"
                      dense
                      class="caption"
                    >
                    </v-text-field>
                  </v-list-item-content>
                  <v-list-item-content
                    class="mr-2"
                    :style="{ minWidth: '120px' }"
                  >
                    <v-menu
                      v-model="menuStartDate[i]"
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
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                          dense
                          class="caption"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="item.licenseStartDate"
                        @input="menuStartDate[i] = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-list-item-content>
                  <v-list-item-content
                    class="ml-2"
                    :style="{ minWidth: '120px' }"
                  >
                    <v-menu
                      v-model="menuEndDate[i]"
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
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                          dense
                          class="caption"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="item.licenseEndDate"
                        @input="menuEndDate[i] = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-list-item-content>
                  <v-list-item-content class="mr-2 ml-3">
                    <v-select
                      :items="likelihoodOptions"
                      v-model="item.likelihood"
                      label="Likelihood"
                      :rules="nameRules"
                      class="caption"
                      dense
                    ></v-select>
                  </v-list-item-content>
                  <v-list-item-content class="justify-center mr-2">
                    <v-checkbox
                      v-model="item.agent"
                      label="Agent"
                      dense
                      class="caption"
                    ></v-checkbox>
                  </v-list-item-content>
                  <v-list-item-content class="mr-2">
                    <v-select
                      :items="agentDiscountOptions"
                      v-model="item.agentDiscount"
                      label="Agent Discount"
                      class="caption"
                      dense
                    ></v-select>
                  </v-list-item-content>
                  <v-list-item-content class="mr-4">
                    <v-text-field
                      v-model="item.grossValue"
                      label="Gross Value"
                      :rules="nameRules"
                      class="caption"
                      dense
                    ></v-text-field>
                  </v-list-item-content>
                  <v-btn icon small @click="deleteProduct(item)"
                    ><v-icon small>delete</v-icon></v-btn
                  >
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
        </v-form>
      </v-flex>
    </v-card>
    <v-card flat>
      <v-btn
        block
        @click="addProduct"
        class="mt-1 overline"
        :style="{ border: '1px solid #455A64' }"
        >+ Add Product</v-btn
      >
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
    <v-dialog v-model="unsavedChangesDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Are you sure?
        </v-card-title>

        <v-card-text class="py-5">
          There are unsaved changes to this Opportunity, please confirm leaving
          this page.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="leavePageWithoutSave">
            Complete this action
          </v-btn>
          <v-btn color="primary" text @click="saveChanges">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loadingDialog" width="200">
      <v-card :loading="loadingDialog">
        <v-card-text class="pa-8 body-2">
          Loading...
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="endSessionDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">
          Network connection lost
        </v-card-title>
        <v-card-text>
          You can wait for connection to restore or Logout.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="onSessionEndDialogClicked">
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';
export default {
  components: {},
  name: 'EditOpp',
  data: () => ({
    menuStartDate: [],
    menuEndDate: [],
    loadingDialog: false,
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
    opportunityStartDate: null,
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
      '<2021',
      '2021',
      '2022'
    ],
    productItems: [],
    typeOfBusinessOptions: ['New', 'Recurring', 'Renewal'],
    products: [],
    licenseStartDate: null,
    licenseEndDate: null,
    likelihoodOptions: [
      '0% - Lost',
      '10% - Low Chance of Winning',
      '20% - Possible but unlikely',
      '40% - Interest, but no commitment',
      '60% - Likely',
      '80% - Very Likely',
      '100% - Confident it will close'
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
    toBeDeletedProductId: null,
    unsavedChangesDialog: false,
    goHome: false,
    endSessionDialog: false,
    isOffline: false,
    isOnline: false,
    noConnection: false
  }),
  filters: {
    formatDate(date) {
      if (!date) return null;
      date = date.toString();
      const format = 'YYYY-MM-DD';
      return (
        moment(date)
          // .utc()
          .format(format)
      );
    }
  },
  methods: {
    ...mapMutations({
      setPage: 'setPage',
      setPerPage: 'setPerPage',
      setTab: 'setTab',
      setProductsOption: 'setProductsOption',
      setOpp: 'setOpp',
      setCurrentOpp: 'setCurrentOpp',
      setFormData: 'setFormData',
      setLoading: 'setLoading',
      setCountries: 'setCountries',
      setStateOptions: 'setStateOptions'
    }),
    ...mapMutations('auth', {
      setCurrentUser: 'setCurrentUser'
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
      try {
        const currentOpp = await this.updateProduct(currentOpportunity);
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        await this.$store.dispatch('updateRecord', currentOpp);
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
          message:
            'Error saving product basket items, please review opportunity',
          type: 'error',
          duration: 3000,
          dismissible: true,
          position: 'bottom',
          onClose: () => {
            // this.$router.push({ name: 'Dashboard' });
            this.newOppLoading = false;
          }
        });
      }
    },
    async updateProduct(currentOpp) {
      await this.$store.dispatch('setCurrentTable', 'Product');
      currentOpp.grossValue = 0;
      for (const key of Object.keys(this.productItems)) {
        // delete this.productItems[key].cryItems;
        // delete this.productItems[key].products;
        // delete this.productItems[key].TOBItems;
        currentOpp.grossValue =
          currentOpp.grossValue +
          Number(this.formatGrossValue(this.productItems[key].grossValue));
        if (!this.productItems[key].id) {
          if (this.productItems[key].typeOfBusiness === 'Renewal') {
            this.productItems[key].renewal = 1;
          }
          this.productItems[key].licenseStartDate = this.formatDate(
            this.productItems[key].licenseStartDate
          );
          this.productItems[key].licenseEndDate = this.formatDate(
            this.productItems[key].licenseEndDate
          );
          await this.$store.dispatch('createRecord', this.productItems[key]);
          // delete this.productItems[key];
        }
        if (this.productItems[key].id) {
          this.productItems[key].grossValue = this.formatGrossValue(
            this.productItems[key].grossValue
          );
          this.productItems[key].licenseStartDate = this.formatDate(
            this.productItems[key].licenseStartDate
          );
          this.productItems[key].licenseEndDate = this.formatDate(
            this.productItems[key].licenseEndDate
          );
          await this.$store.dispatch('updateRecord', this.productItems[key]);
        }
      }
      return currentOpp;
    },
    async validate() {
      if (
        this.productItems.length &&
        this.$refs.productForm.validate() &&
        this.$refs.form.validate()
      ) {
        await this.updateOpportunity(this.getFormData());
      } else if (
        (this.productItems.length && !this.$refs.productForm.validate()) ||
        !this.$refs.form.validate()
      ) {
      } else if (this.$refs.form.validate()) {
        await this.updateOpportunity(this.getFormData());
      }
    },
    reset() {
      this.$router.back();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async getStatesForCurrentCountry(country, states) {
      this.states = [];
      for (let i = 0; i < states.length; i += 1) {
        if (
          states[i] &&
          country &&
          country.toLowerCase().trim() ===
            states[i].Country.toLowerCase().trim()
        ) {
          this.states.push(states[i].Name);
        }
      }
      if (!this.states.length) {
        this.states.push('N/A');
        this.state = this.states[0];
      }
      return this.states;
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
    async onCountryChange() {
      this.state = null;
      this.states = await this.getStatesForCurrentCountry(
        this.country,
        this.stateOptions
      );
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
    getProducts: async function() {
      // this.productItems = [];
      const prodItems = [];
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      const data = await this.$store.dispatch('getRecords', this.opportunityId);
      for (let i = 0; i < data.length; i += 1) {
        const product = {
          opportunity_fk: data[i].Opportunity_fk,
          id: data[i].Id,
          cryItems: this.cryOptions,
          TOBItems: this.typeOfBusinessOptions,
          cry: data[i].CRY,
          typeOfBusiness: data[i].TypeOfBusiness,
          products: this.products,
          productName: data[i].ProductName,
          productDescription: data[i].ProductDescription,
          licenseStartDate: this.formatDate(data[i].LicenseStartDate),
          licenseEndDate: this.formatDate(data[i].LicenseEndDate),
          likelihood: data[i].Likelihood,
          agent: data[i].Agent,
          agentDiscount: data[i].AgentDiscount,
          grossValue: this.formatCurrency(data[i].GrossValue)
        };
        // this.productItems.push(product);
        prodItems.push(product);
      }
      return prodItems;
    },
    formatDate(date) {
      if (!date) return null;
      date = date.toString();
      const format = 'YYYY-MM-DD';
      return (
        moment(date)
          // .utc()
          .format(format)
      );
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
      // console.log(this.productItems);
      this.menuEndDate.push(false);
      this.menuStartDate.push(false);
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
    async deleteExistingProduct() {
      await this.$store.dispatch('setCurrentTable', 'Product');
      try {
        await this.$store.dispatch('deleteRecord', this.toBeDeletedProductId);
        this.deleteProductDialog = false;
        this.productItems = [];
        this.productItems = await this.getProducts();
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
    getProductOptions: async function() {
      if (this.productsOption.length) {
        this.products = this.productsOption;
      } else {
        await this.$store.dispatch('setCurrentTable', 'Products');
        const data = await this.$store.dispatch('getProducts', '');
        // Object.keys(data).forEach(key => {
        //   this.products.push(data[key].Category_Description);
        // });
        for (let i = 0; i < data.length; i += 1) {
          this.products.push(data[i].Category_Description);
        }
        await this.setProductsOption(this.products);
      }
    },
    getCountries: async function() {
      if (this.countries.length) {
        this.countryItems = this.countries;
      } else {
        await this.$store.dispatch(
          'setCurrentTable',
          'Country_Region_Territory'
        );
        const countries = await this.$store.dispatch(
          'getCountryRegionTerritory',
          ''
        );
        for (let i = 0; i < countries.length; i += 1) {
          if (countries[i]) this.countryItems.push(countries[i].Country);
        }
        this.setCountries(this.countryItems);
      }
    },
    async init() {
      if (this.opportunityId) {
        this.setPage('');
        this.setTab('opp');
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        await this.getProductOptions();
        this.productItems = [];
        this.productItems = await this.getProducts();
        await this.getCountries();
        await this.getStates();
        this.salesRepType = this.opportunity.Type;
        this.salesRep = this.opportunity.SalesRep;
        this.opportunityName = this.opportunity.OpportunityName;
        this.customerName = this.opportunity.CustomerName;
        this.bpId = this.opportunity.BPID;
        this.memberOfConsortia = this.opportunity.MemberOfConsortia;
        this.country = this.opportunity.Country;
        this.state = this.opportunity.State;
        this.states = await this.getStatesForCurrentCountry(
          this.country,
          this.stateOptions
        );
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
        this.opportunityStartDate = this.formatDate(
          this.opportunity.OpportunityStartDate
        );
      } else {
        await this.$router.push({ name: 'Dashboard' });
      }
    },
    formatCurrency(amount) {
      if (!amount) return '';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getCurrentOpp() {
      const data = this.getFormData();
      const currentOpp = {};
      for (const [keyOpp, valueOpp] of Object.entries(this.opportunity)) {
        for (const [keyForm, valueForm] of Object.entries(data)) {
          if (keyOpp === keyForm) {
            currentOpp[keyForm] = valueForm;
          }
        }
      }
      currentOpp.id = this.opportunityId;
      this.setCurrentOpp(currentOpp);
    },
    saveChanges() {
      this.unsavedChangesDialog = false;
    },
    leavePageWithoutSave() {
      if (this.goHome) {
        window.BUS.$emit('nav-home');
        this.goHome = false;
      } else {
        window.BUS.$emit('leave-page');
        this.unsavedChangesDialog = false;
      }
    },
    formatGrossValue(value) {
      value = value.replace(/,/g, '');
      return value;
    },
    onExpectedCloseDateChange(value) {
      // this.expectedCloseDate = value;
      this.menu2 = false;
    },
    onOppStartDateChange(value) {
      this.opportunityStartDate = value;
    },
    onSessionEndDialogClicked() {
      this.endSessionDialog = false;
      this.setCurrentUser(null);
      this.$router.push('/login');
    },
    handleConnection() {
      if (navigator.onLine) {
        const self = this;
        this.isReachable(this.getServerUrl()).then(async function(online) {
          if (online) {
            // handle online status
            self.isOnline = true;
            await self.init();
            self.endSessionDialog = false;
          } else {
            self.isOnline = false;
            self.endSessionDialog = true;
          }
        });
      } else {
        // handle offline status
        this.isOffline = true;
        this.isOnline = false;
        this.endSessionDialog = true;
      }
    },
    getServerUrl() {
      return (
        document.getElementById('editOppForm').value || window.location.origin
      );
    },
    isReachable(url) {
      return fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(function(resp) {
          return resp && (resp.ok || resp.type === 'opaque');
        })
        .catch(function(err) {
          console.warn('[conn test failure]:', err);
        });
    }
  },
  mounted() {
    window.addEventListener('online', this.handleConnection);
    window.addEventListener('offline', this.handleConnection);
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState([
      'loading',
      'opportunityId',
      'opportunity',
      'currentOpp',
      'productsOption',
      'countries',
      'stateOptions'
    ]),
    isState() {
      return this.states.length === 1 && this.state === 'N/A';
    }
  },
  async created() {
    this.loadingDialog = true;
    window.BUS.$on('opp-changed', () => {
      this.unsavedChangesDialog = true;
    });
    window.BUS.$on('go-home', () => {
      this.unsavedChangesDialog = true;
      this.goHome = true;
    });
    try {
      await this.init();
      const formData = this.getFormData();
      this.setCurrentOpp(formData);
      for (let i = 0; i < this.productItems.length; i += 1) {
        this.menuEndDate.push(false);
        this.menuStartDate.push(false);
      }
      // console.log(this.menuEndDate[0].med);
    } catch (e) {
      console.log(e);
      await this.$router.push({ name: 'Dashboard' });
    }
    this.loadingDialog = false;
  },
  updated() {
    const formData = this.getFormData();
    this.setFormData(formData);
  },
  beforeDestroy() {
    this.setFormData(null);
    this.setCurrentOpp(null);
  }
};
</script>
<style>
.vdp-datepicker input {
  width: 110px;
}
</style>
