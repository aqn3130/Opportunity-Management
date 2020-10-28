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
        </template>
        <template v-slot:item.ExpectedCloseDate="{ item }">
          <span class="caption">
            {{ item.ExpectedCloseDate | convertDate }}
          </span>
        </template>
        <template v-slot:item.GrossValue="{ item }">
          <span class="caption">
            {{ item.GrossValue | formatCurrency }}
          </span>
        </template>
      </v-data-table>
    </v-container>
    <v-container>
      <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
        <v-spacer></v-spacer>
        {{ productTitle }}
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table :items="products" :headers="productHeaders">
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
      oppTitle: 'Opportunities'
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Opportunity Name', align: 'left', value: 'OpportunityName' },
        { text: 'Country', align: 'left', value: 'Country' },
        { text: 'Channel Type', align: 'left', value: 'ChannelType' },
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
        { text: 'License ID', align: 'left', value: 'LicenseID' },
        {
          text: 'Expected Close Date',
          align: 'left',
          value: 'ExpectedCloseDate'
        },
        { text: 'Currency', align: 'left', value: 'Currency' },
        { text: 'Gross Value', align: 'left', value: 'GrossValue' }
      ];
    },
    ...mapState(['loading', 'opportunityId']),
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
    }
  },
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    // this.opts = await this.$store.dispatch('getRecords', '');
  },
  filters: {
    convertDate: value => {
      if (!value) return null;
      value = value.toString();
      return moment(value).format('YYYY-MM-DD');
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
      setFilter: 'setFilter'
    }),
    async onOpportunitySelect(item) {
      this.searchStr = '';
      this.setSearchStr(this.searchStr);
      this.products = await this.getProducts(item.Id);
      this.notes = await this.getNotes(item.Id);
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
      return (
        moment(date)
          // .utc()
          .format(format)
      );
    },
    formatCurrency(amount) {
      if (!amount) return '';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};
</script>

<style scoped></style>
