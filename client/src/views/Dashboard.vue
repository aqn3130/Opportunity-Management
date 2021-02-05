<template>
  <div id="dashboard">
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
        class="d-flex transparent mb-10 ml-auto mr-auto"
        flat
        style="z-index: 2; margin-top: -160px;"
        width="auto"
      >
        <v-row>
          <v-col>
            <v-toolbar class="transparent" flat dense>
              <!--              <v-select-->
              <!--                v-model="selectedStatus"-->
              <!--                :items="statuses"-->
              <!--                style="width: 300px"-->
              <!--                dark-->
              <!--                class="caption"-->
              <!--                dense-->
              <!--                multiple-->
              <!--              ></v-select>-->
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
              :headers="showHeaders"
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
              :loading="loading"
              :style="{ cursor: 'pointer' }"
              :sort-by="['ExpectedCloseDate']"
              :sort-desc="[false]"
            >
              <template
                v-for="(col, i) in filters"
                v-slot:[`header.${i}`]="{ header }"
              >
                <div style="display: inline-block; padding: 16px 0;" :key="i">
                  {{ header.text }}
                </div>
                <div style="float: right; margin-top: 8px" :key="i + 'key'">
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y
                    transition="slide-y-transition"
                    left
                    fixed
                    style="position: absolute; right: 0"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                        <v-icon
                          small
                          :color="
                            activeFilters[header.value] &&
                            activeFilters[header.value].length <
                              filters[header.value].length
                              ? 'red'
                              : 'default'
                          "
                        >
                          mdi-filter-variant
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list
                      flat
                      dense
                      class="pa-0 overflow-auto"
                      max-height="300"
                    >
                      <v-list-item-group
                        multiple
                        v-model="activeFilters[header.value]"
                        class="py-2"
                      >
                        <template v-for="item in filters[header.value]">
                          <v-list-item
                            :key="`${item}`"
                            :value="item"
                            :ripple="false"
                          >
                            <template v-slot:default="{ active, toggle }">
                              <v-list-item-action>
                                <v-checkbox
                                  :input-value="active"
                                  :true-value="item"
                                  @click="toggle"
                                  color="primary"
                                  :ripple="false"
                                  dense
                                  @change="toggle"
                                ></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="item"
                                ></v-list-item-title>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </template>
                      </v-list-item-group>
                      <v-divider></v-divider>
                      <v-row no-gutters>
                        <v-col cols="6">
                          <v-btn
                            text
                            block
                            @click="toggleAll(header.value)"
                            color="success"
                            >Toggle all</v-btn
                          >
                        </v-col>
                        <v-col cols="6">
                          <v-btn
                            text
                            block
                            @click="clearAll(header.value)"
                            color="warning"
                            >Clear all</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-list>
                  </v-menu>
                </div>
              </template>
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
                    @click:clear="clearSearch"
                    @input="searchMyOpportunities"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <template v-slot:item.OpportunityName="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 120px; font-weight: bold"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.OpportunityName }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.OpportunityName }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 120px;"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.SalesStage }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.SalesStage }}</span>
                </v-tooltip>
<!--                <v-tooltip bottom>-->
<!--                  <template v-slot:activator="{ on, attrs }">-->
<!--                    <v-list-item-subtitle v-bind="attrs" v-on="on">-->
<!--                      <span-->
<!--                        style="font-size: small; max-width: 200px"-->
<!--                        class="text-truncate d-inline-block"-->
<!--                      >-->
<!--                        {{ item.CustomerName }}-{{ item.BPID }}-->
<!--                      </span>-->
<!--                    </v-list-item-subtitle>-->
<!--                  </template>-->
<!--                  <span>{{ item.CustomerName }}-{{ item.BPID }}</span>-->
<!--                </v-tooltip>-->
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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 100px"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.ChannelType }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.ChannelType }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.Country="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 100px"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.Country }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.Country }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.CustomerName="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on">
                      <span
                        style="font-size: small; max-width: 100px"
                        class="text-truncate d-inline-block"
                      >
                        {{ item.CustomerName }}
                      </span>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item.CustomerName }}</span>
                </v-tooltip>
              </template>
              <!--                <template v-slot:item.source="{ item }">-->
              <!--                  <span class="caption">-->
              <!--                    {{ item.source | formatSAP }}-->
              <!--                  </span>-->
              <!--                </template>-->
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-layout>
    <v-btn
      absolute
      dark
      fab
      bottom
      right
      color="#455A64"
      class="mb-16 mr-1"
      link
      to="/new-opportunity"
      fixed
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      rows: [],
      OppStatus: null,
      statuses: ['All', 'In Process', 'Won', 'Closed Won', 'Closed Lost'],
      searchStr: '',
      selectedStatus: [],
      page: 0,
      perPage: 15,
      totalLeads: 0,
      options: {},
      filters: {
        Status: [],
        ChannelType: [],
        // Currency: [],
        Country: []
        // source: []
      },
      activeFilters: {},
      selectedHeaders: [],
      headersFilter: [],
      dialogColFilter: false,
      toggleDense: true,
      endSessionDialog: false,
      isOffline: false,
      isOnline: false,
      noConnection: false,
      fontWeightAll: null,
      fontWeightSapCreated: null,
      sapFilter: false,
      fontWeightNormal: 'fontWeightNormal',
      fontWeightLight: 'fontWeightLight'
    };
  },
  filters: {
    convertDate: value => {
      if (!value) return null;
      value = value.toString();
      return (
        moment(value)
          // .utc()
          .format('YYYY-MM-DD')
      );
    },
    formatCurrency(amount) {
      if (!amount) return '';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatSAP(val) {
      if (!val) return 'PLM';
      return val === 'PLM' ? 'PLM' : 'SAP';
    }
  },
  async created() {
    await this.init();
  },
  computed: {
    showHeaders() {
      return this.headers.filter(s => this.selectedHeaders.includes(s));
    },
    headers() {
      return [
        {
          text: 'Opportunity Name',
          align: 'left',
          value: 'OpportunityName'
        },
        {
          text: 'Customer Name',
          align: 'left',
          value: 'CustomerName'
        },
        {
          text: 'BPID',
          align: 'left',
          value: 'BPID'
        },
        {
          text: 'Country',
          align: 'left',
          value: 'Country',
          filter: value => {
            return this.activeFilters.Country
              ? this.activeFilters.Country.includes(value)
              : true;
          }
        },
        {
          text: 'Channel Type',
          align: 'left',
          value: 'ChannelType',
          filter: value => {
            return this.activeFilters.ChannelType
              ? this.activeFilters.ChannelType.includes(value)
              : true;
          }
        },
        {
          text: 'Status',
          align: 'left',
          value: 'Status',
          filter: value => {
            return this.activeFilters.Status
              ? this.activeFilters.Status.includes(value)
              : true;
          }
        },
        // {
        //   text: 'License ID',
        //   align: 'left',
        //   value: 'LicenseID'
        // },
        {
          text: 'Expected Close Date',
          align: 'left',
          value: 'ExpectedCloseDate'
        },
        {
          text: 'Currency',
          align: 'left',
          value: 'Currency'
        },
        { text: 'Gross Value', align: 'left', value: 'GrossValue' }
      ];
    },
    ...mapState(['loading']),
    ...mapState('auth', ['currentUser'])
  },
  watch: {
    rows(val) {
      this.initFilters();
      //this.activeFilters = {} // TODO change this
      //this.activeFilters = Object.assign({}, this.filters)
    }
  },
  mounted() {
    window.addEventListener('online', this.handleConnection);
    window.addEventListener('offline', this.handleConnection);
  },
  updated() {
    this.toggleWonInProcess('Status');
  },
  methods: {
    async init() {
      if (!this.currentUser) await this.$router.push({ name: 'Login' });
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      this.rows = await this.getRecords();
      if (this.loading) this.setLoading(false);
      this.headersFilter = Object.values(this.headers);
      this.selectedHeaders = this.headersFilter;
      this.fontWeightAll = this.fontWeightNormal;
      this.fontWeightSapCreated = this.fontWeightLight;
    },
    getRecords: async function() {
      return await this.$store.dispatch(
        'getCurrentSalesRepOpts',
        this.currentUser.salesRep.Full_Name
      );
    },
    ...mapMutations({
      setOppId: 'setOppId',
      setOpp: 'setOpp',
      setPage: 'setPage',
      setPerPage: 'setPerPage',
      setSearchStr: 'setSearchStr',
      setFilter: 'setFilter',
      setLoading: 'setLoading'
    }),
    ...mapActions('auth', ['logout']),
    ...mapMutations('auth', {
      setCurrentUser: 'setCurrentUser'
    }),
    editOpportunity(item) {
      this.setOppId(item.Id);
      this.setOpp(item);
      this.$router.push({ name: 'Edit Opportunity' });
      // console.log(item);
    },
    clearSearch() {
      this.searchStr = '';
      this.setSearchStr('');
      this.init();
    },
    initFilters() {
      if (this.rows.length) {
        for (let col in this.filters) {
          this.filters[col] = this.rows
            .map(d => {
              return d[col];
            })
            .filter((value, index, self) => {
              return self.indexOf(value) === index;
            });
        }
        // TODO restore previous activeFilters before add/remove item
        this.activeFilters = Object.assign({}, this.filters);
        /*if (Object.keys(this.activeFilters).length === 0) this.activeFilters = Object.assign({}, this.filters)
        else {
          setTimeout(() => {
            console.log(this.activeFilters)
            //this.activeFilters = Object.assign({}, this.filters)
          }, 1)
        }*/
      }
    },
    toggleAll(col) {
      if (this.rows.length) {
        this.activeFilters[col] = this.rows
          .map(d => {
            return d[col];
          })
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
      }
    },
    toggleWonInProcess(col) {
      if (this.rows.length) {
        // console.log(col);
        this.activeFilters[col] = this.rows
          .map(d => {
            return d[col];
          })
          .filter((value, index, self) => {
            if (value === 'In Process' || value === 'Won')
              return self.indexOf(value) === index;
          });
      }
    },

    clearAll(col) {
      this.activeFilters[col] = [];
    },
    // async onSelectChange(status) {
    // this.selectedStatus = status;
    // console.log(status);
    // },

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
        document.getElementById('dashboard').value || window.location.origin
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
    },
    onSessionEndDialogClicked() {
      this.endSessionDialog = false;
      this.setCurrentUser(null);
      this.$router.push('/login');
    },
    async searchMyOpportunities(searchString) {
      this.setSearchStr(searchString);
      await this.init();
    },
    onFilterChange(filter) {
      const rows = [];
      if (filter === 'sap') {
        this.fontWeightAll = this.fontWeightLight;
        this.fontWeightSapCreated = this.fontWeightNormal;
        this.sapFilter = true;
        for (let i = 0; i < this.rows.length; i += 1) {
          if (this.rows[i].source === 'SAP') {
            rows.push(this.rows[i]);
          }
        }
      } else if (filter === 'all') {
        this.fontWeightAll = this.fontWeightNormal;
        this.fontWeightSapCreated = this.fontWeightLight;
        this.sapFilter = false;
        this.clearSearch();
      }
      return rows;
    },
    onAllFilterSelect() {
      this.sapFilter = false;
      this.onFilterChange('all');
    },
    onSAPFilterSelect() {
      this.sapFilter = true;
      this.rows = this.onFilterChange('sap');
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
