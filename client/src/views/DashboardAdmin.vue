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
        class="d-flex transparent ml-auto mr-auto"
        flat
        style="z-index: 2; margin-top: -180px;"
        width="auto"
      >
        <v-row>
          <v-col>
            <v-toolbar class="transparent" flat dense>
              <v-select
                v-model="selectedStatus"
                :items="statuses"
                @change="onSelectChange"
                style="max-width: 110px"
                dark
                class="caption"
                dense
                multiple
              >
                <template v-slot:selection="{ item, index }">
                  <span v-if="index === 0">
                    <span>{{ item }}</span>
                  </span>
                  <span v-if="index === 1" class="caption">
                    <!--                    (+{{ selectedStatus.length - 1 }} )-->
                    ...
                  </span>
                </template>
              </v-select>
              <v-spacer></v-spacer>
              <v-card class="py-2 transparent" flat tile height="50" dark>
                <v-btn
                  x-small
                  text
                  @click="onAllFilterSelect"
                  class="text--accent-2 font-weight-regular"
                  v-bind:class="fontWeightAll"
                >
                  All
                </v-btn>
                <v-divider vertical inset class="white"></v-divider>
                <v-btn
                  x-small
                  text
                  @click="onSAPFilterSelect"
                  class="text--accent-2 font-weight-regular"
                  v-bind:class="fontWeightSapCreated"
                >
                  Accepted Leads
                </v-btn>
              </v-card>
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
              @click:row="editOpportunity"
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
                    class="mt-6"
                    light
                    @change="search"
                    @click:clear="clearSearch"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <template v-slot:item.OpportunityName="{ item }">
                <span style="font-size: small; font-weight: bold;">
                  {{ item.OpportunityName }} </span
                ><br />
                <span style="font-size: small">
                  {{ item.SalesStage }}<br />
                </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 200px"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.CustomerName }}-{{ item.BPID }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.CustomerName }}-{{ item.BPID }}</span>
                </v-tooltip>
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
              <template v-slot:item.Currency="{ item }">
                <span class="caption">
                  {{ item.Currency }}
                </span>
              </template>
              <template v-slot:item.Status="{ item }">
                <span class="caption">
                  {{ item.Status }}
                </span>
              </template>
              <template v-slot:item.ChannelType="{ item }">
                <span class="caption">
                  {{ item.ChannelType }}
                </span>
              </template>
              <template v-slot:item.Country="{ item }">
                <span class="caption">
                  {{ item.Country }}
                </span>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-layout>
    <!--    <v-btn-->
    <!--      absolute-->
    <!--      dark-->
    <!--      fab-->
    <!--      bottom-->
    <!--      right-->
    <!--      color="#455A64"-->
    <!--      class="mb-16 mr-1"-->
    <!--      link-->
    <!--      to="/new-opportunity"-->
    <!--      fixed-->
    <!--    >-->
    <!--      <v-icon>mdi-plus</v-icon>-->
    <!--    </v-btn>-->
  </div>
</template>

<script>
import moment from 'moment';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'DashboardAdmin',
  components: {},
  data() {
    return {
      rows: [],
      OppStatus: null,
      statuses: ['In Process', 'Won', 'Closed Won', 'Closed Lost'],
      searchStr: '',
      selectedStatus: ['In Process', 'Won', 'Closed Won', 'Closed Lost'],
      page: 0,
      perPage: 5,
      totalLeads: 0,
      options: {},
      fontWeightNormal: 'fontWeightNormal',
      fontWeightLight: 'fontWeightLight',
      fontWeightAll: null,
      fontWeightSapCreated: null,
      sapCreated: [],
      sapFilter: false
    };
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
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    this.fontWeightAll = this.fontWeightNormal;
    this.fontWeightSapCreated = this.fontWeightLight;
    // await this.getRecords();
    // this.selectedStatus.push(this.statuses[0]);
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
            if (_.isEqual(this.selectedStatus, this.statuses)) return true;
            return this.selectedStatus.includes(value);
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
    ...mapState(['loading'])
  },
  watch: {
    options: {
      handler() {
        if (this.sapFilter) {
          this.onFilterChange('sap');
        } else {
          this.setSearchStr(this.searchStr);
          // this.setFilter(this.statuses[0]);
          this.getDataFromApi().then(data => {
            this.rows = data.items;
            this.totalLeads = data.total;
            // console.log(data);
          });
        }
      },
      deep: true
    }
  },
  mounted() {},
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
    editOpportunity(item) {
      this.searchStr = '';
      this.setSearchStr(this.searchStr);
      this.setOppId(item.Id);
      this.setOpp(item);
      this.setFilter('');
      this.$router.push({ name: 'Edit Opportunity' });
      // console.log(item);
    },
    async onSelectChange(statuses) {
      this.setFilter(statuses);
      if (this.searchStr) this.setSearchStr(this.searchStr);
      if (this.sapFilter) {
        this.onSAPFilterSelect();
      } else {
        this.getDataFromApi().then(data => {
          this.rows = data.items;
          this.totalLeads = data.total;
        });
      }
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
      if (this.sapFilter) {
        this.onSAPFilterSelect();
      } else {
        this.getDataFromApi().then(data => {
          this.rows = data.items;
          this.totalLeads = data.total;
        });
      }
    },
    clearSearch() {
      this.searchStr = '';
      this.search();
    },
    async onFilterChange(filter) {
      if (filter === 'sap') {
        this.fontWeightAll = this.fontWeightLight;
        this.fontWeightSapCreated = this.fontWeightNormal;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        this.setPage(page);
        this.setPerPage(itemsPerPage);
        this.sapFilter = true;
        // this.setPage(1);
        const { opts, totalOpts } = await this.$store.dispatch('getSAPSourced');
        this.rows = opts;
        this.totalLeads = totalOpts;
      } else if (filter === 'all') {
        this.fontWeightAll = this.fontWeightNormal;
        this.fontWeightSapCreated = this.fontWeightLight;
        this.sapFilter = false;
        this.searchStr = '';
        await this.search();
      }
    },
    onAllFilterSelect() {
      this.sapFilter = false;
      this.onFilterChange('all');
    },
    onSAPFilterSelect() {
      this.sapFilter = true;
      this.onFilterChange('sap');
    }
  }
};
</script>
<style scoped>
.fontWeightNormal {
  font-weight: normal;
  text-decoration-line: underline;
}
.fontWeightLight {
  font-weight: lighter;
}
.fontWeight {
  font-weight: lighter;
}
</style>
