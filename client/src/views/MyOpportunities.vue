<template>
  <div>
    <v-card
      style="z-index: 1;margin-top: -50px"
      color="#607D8B"
      height="200"
      width="auto"
      tile
      dark
    >
      <v-card-text class="text-center overline"> </v-card-text>
    </v-card>
    <v-layout>
      <v-card
        style="z-index: 2; margin-top: -150px;"
        class="d-flex transparent mb-10 overflow-auto ml-auto mr-auto container"
        flat
      >
        <vue-good-table
          :columns="columns"
          :rows="rows"
          :search-options="{
            enabled: true,
            placeholder: 'Search Opportunities'
          }"
          :line-numbers="true"
          compactMode
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 5,
            position: 'bottom',
            perPageDropdown: [15, 25],
            dropdownAllowAll: true,
            setCurrentPage: 1,
            nextLabel: 'next',
            prevLabel: 'prev',
            rowsPerPageLabel: 'Rows per page',
            ofLabel: 'of',
            pageLabel: 'page', // for 'pages' mode
            allLabel: 'All'
          }"
          styleClass="vgt-table condensed"
          rowStyleClass="VGT-row"
          :fixed-header="true"
          :rtl="false"
          @on-row-click="editOpportunity"
        >
<!--          <template slot="table-header-row" slot-scope="props">-->
<!--            <span class="vueGoodTable">-->
<!--              {{ props.row.label }}-->
<!--            </span>-->
<!--          </template>-->
        </vue-good-table>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
// import 'vue-good-table/dist/vue-good-table.css';
import {mapMutations, mapState} from 'vuex';
export default {
  name: 'MyOpportunities',
  components: {
    VueGoodTable
  },
  data() {
    return {
      rows: [],
      columns: [
        {
          label: 'Opportunity',
          field: 'OpportunityName',
          tdClass: this.tdClassFunc,
          filterOptions: {
            styleClass: 'vgt-table',
            enabled: true,
            placeholder: 'Opportunity Name',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        },
        {
          label: 'Customer Name',
          field: 'CustomerName',
          tdClass: this.tdClassFunc,
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'Customer Name',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        },
        {
          label: 'BPID',
          field: 'BPID',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'BPID',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        },
        {
          label: 'Country',
          field: 'Country',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'Country',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        },
        {
          label: 'Channel',
          field: 'ChannelType',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: ['Academic', 'Corporate', 'Government'],
            trigger: 'enter'
          }
        },
        {
          label: 'Status',
          field: 'Status',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: ['In Process', 'Won', 'Closed Won', 'Closed Lost'],
            trigger: 'enter'
          }
        },
        {
          label: 'Close Date',
          field: 'ExpectedCloseDate',
          type: 'date',
          dateInputFormat: 'yyyy-MM-dd HH:mm:ss',
          dateOutputFormat: 'yyyy-MM-dd',
          sortable: true,
          firstSortType: 'desc',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'Expected Close Date',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        },
        {
          label: 'Currency',
          field: 'Currency',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: ['EUR', 'USD', 'GBP', 'JPY', 'AUD'],
            trigger: 'enter'
          }
        },
        {
          label: 'Gross Value',
          field: 'GrossValue',
          filterOptions: {
            styleClass: 'class1',
            enabled: true,
            placeholder: 'Gross Value',
            filterDropdownItems: [],
            trigger: 'enter'
          }
        }
      ],
      page: 0,
      perPage: 15,
      isOffline: false,
      isOnline: false,
      noConnection: false,
      searchStr: ''
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('auth', ['currentUser'])
  },
  async created() {
    await this.init();
  },
  methods: {
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
    getRecords: async function() {
      return await this.$store.dispatch(
        'getCurrentSalesRepOpts',
        this.currentUser.salesRep.Full_Name
      );
    },
    async init() {
      if (!this.currentUser) await this.$router.push({ name: 'Login' });
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      this.rows = await this.getRecords();
      if (this.loading) this.setLoading(false);
    },
    editOpportunity({ row }) {
      console.log(row);
      this.setOppId(row.Id);
      this.setOpp(row);
      this.$router.push({ name: 'Edit Opportunity' });
      // console.log(item);
    },
  },
  tdClassFunc(row) {
    if (row.field > 20) {
      return 'longValue';
    }
    return 'green-class';
  },
};
</script>

<style>
.vgt-table td {
  padding: 5px 25px 5px !important;
  vertical-align: middle !important;
  horiz-align: left !important;
  font-size: 12px !important;
  font-weight: bolder;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vgt-table th {
  text-align: center !important;
  font-size: 12px !important;
}
.longValue {
  max-width: 100px;
}
</style>
