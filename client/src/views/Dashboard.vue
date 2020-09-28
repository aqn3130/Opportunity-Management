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
      <v-container class="mb-10 pa-5" style="z-index: 2; margin-top: -150px;">
        <v-card
          class="d-flex ml-auto mr-auto justify-center transparent mt-n10"
          flat
          width="auto"
        >
          <v-row>
            <v-col>
              <v-select
                v-model="selectedStatus"
                :items="statuses"
                @change="onSelectChange"
                style="width: 110px"
                dark
                class="caption"
                dense
              ></v-select>
              <v-data-table
                :headers="headers"
                :items="rows"
                :items-per-page="perPage"
                class="elevation-1"
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
                  <v-toolbar flat color="grey lighten-3">
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
                  <span>
                    {{ item.ExpectedCloseDate | convertDate }}
                  </span>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-layout>
    <v-btn
      absolute
      dark
      fab
      bottom
      right
      color="#455A64"
      class="mb-10 mr-10"
      link
      to="/new-opportunity"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import moment from 'moment';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'dashboard',
  components: {},
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
      options: {}
    };
  },
  filters: {
    convertDate: value => {
      if (!value) return '';
      value = value.toString();
      return moment(value).format('YYYY-MM-DD');
    }
  },
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    // await this.getRecords();
    this.selectedStatus = this.statuses[0];
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
    ...mapState(['loading']),
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi().then(data => {
          this.rows = data.items;
          this.totalLeads = data.total;
          // console.log(data);
        });
      },
      deep: true
    }
  },
  mounted() {
    // this.getDataFromApi().then(data => {
    //   this.rows = data.items;
    //   this.totalLeads = data.total;
    // });
  },
  methods: {
    getRecords: async function() {
      return await this.$store.dispatch('getRecords', '');
    },
    ...mapMutations({
      setOppId: 'setOppId',
      setOpp: 'setOpp',
      setPage: 'setPage',
      setPerPage: 'setPerPage'
    }),
    editOpportunity(item) {
      this.setOppId(item.Id);
      this.setOpp(item);
      this.$router.push({ name: 'Edit Opportunity' });
      // console.log(item);
    },
    onSelectChange(status) {
      console.log(status);
    },
    getDataFromApi() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        this.setPage(page);
        this.setPerPage(itemsPerPage);
        const { opts, totalOpts } = await this.getRecords();
        const total = totalOpts;
        let items = opts;

        // console.log(items);
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
    }
  }
};
</script>
