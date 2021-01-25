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
        class="d-flex transparent mb-10 overflow-auto ml-auto mr-auto container"
        flat
        style="z-index: 2; margin-top: -160px;"
      >
        <v-row>
          <v-col>
            <!--              <v-select-->
            <!--                v-model="selectedStatus"-->
            <!--                :items="statuses"-->
            <!--                style="width: 300px"-->
            <!--                dark-->
            <!--                class="caption"-->
            <!--                dense-->
            <!--                multiple-->
            <!--              ></v-select>-->
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
              :search="searchStr"
              :loading="loading"
              :style="{ cursor: 'pointer' }"
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
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <!--                    <div class="text-left">-->
                  <!--                      <v-dialog v-model="dialogColFilter" width="500">-->
                  <!--                        <template v-slot:activator="{ on, attrs }">-->
                  <!--                          <v-btn-->
                  <!--                            text-->
                  <!--                            v-bind="attrs"-->
                  <!--                            v-on="on"-->
                  <!--                            light-->
                  <!--                            color="grey"-->
                  <!--                            small-->
                  <!--                          >-->
                  <!--                            <v-icon>view_column</v-icon>-->
                  <!--                          </v-btn>-->
                  <!--                        </template>-->
                  <!--                        <v-card>-->
                  <!--                          <v-card-title class="headline grey lighten-2">-->
                  <!--                            Column Filter-->
                  <!--                          </v-card-title>-->
                  <!--                          <v-card-text class="py-10">-->
                  <!--                            <div>-->
                  <!--                              <v-select-->
                  <!--                                v-model="selectedHeaders"-->
                  <!--                                :items="headersFilter"-->
                  <!--                                label="Select Columns"-->
                  <!--                                multiple-->
                  <!--                                outlined-->
                  <!--                                return-object-->
                  <!--                              >-->
                  <!--                                <template v-slot:selection="{ item, index }">-->
                  <!--                                  <v-chip v-if="index < 2">-->
                  <!--                                    <span>{{ item.text }}</span>-->
                  <!--                                  </v-chip>-->
                  <!--                                  <span-->
                  <!--                                    v-if="index === 2"-->
                  <!--                                    class="grey&#45;&#45;text caption"-->
                  <!--                                    >(+{{-->
                  <!--                                      selectedHeaders.length - 2-->
                  <!--                                    }}-->
                  <!--                                    others)</span-->
                  <!--                                  >-->
                  <!--                                </template>-->
                  <!--                              </v-select>-->
                  <!--                            </div>-->
                  <!--                          </v-card-text>-->

                  <!--                          <v-divider></v-divider>-->

                  <!--                          <v-card-actions>-->
                  <!--                            <v-spacer></v-spacer>-->
                  <!--                            <v-btn-->
                  <!--                              color="primary"-->
                  <!--                              text-->
                  <!--                              @click="dialogColFilter = false"-->
                  <!--                            >-->
                  <!--                              Done-->
                  <!--                            </v-btn>-->
                  <!--                          </v-card-actions>-->
                  <!--                        </v-card>-->
                  <!--                      </v-dialog>-->
                  <!--                    </div>-->
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
      toggleDense: true
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
    let initialCols = [];
    if (!this.currentUser) await this.$router.push({ name: 'Login' });
    await this.$store.dispatch('setCurrentTable', 'Opportunity');
    this.rows = await this.getRecords();
    if (this.loading) this.setLoading(false);
    // this.selectedStatus.push(this.statuses[0]);
    this.headersFilter = Object.values(this.headers);
    // initialCols = Object.values(this.headers);
    // initialCols.splice(2, 1);
    // initialCols.splice(5, 1);
    // this.selectedHeaders = initialCols;
    this.selectedHeaders = this.headersFilter;
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
        // {
        //   text: 'Source',
        //   align: 'left',
        //   value: 'source',
        //   filter: value => {
        //     return this.activeFilters.source
        //       ? this.activeFilters.source.includes(value)
        //       : true;
        //   }
        //   // width: '120'
        // },
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
          // width: '150'
        },
        {
          text: 'Status',
          align: 'left',
          value: 'Status',
          // filter: value => {
          //   if (!this.selectedStatus) return true;
          //   if (this.selectedStatus[0] && this.selectedStatus[0].length === 1 && this.selectedStatus[0] === this.statuses[0]) return true;
          //   return value === this.selectedStatus;
          // }
          filter: value => {
            return this.activeFilters.Status
              ? this.activeFilters.Status.includes(value)
              : true;
          }
          // width: '110'
        },
        // { text: 'License ID', align: 'left', value: 'LicenseID' },
        {
          text: 'Expected Close Date',
          align: 'left',
          value: 'ExpectedCloseDate'
        },
        {
          text: 'Currency',
          align: 'left',
          value: 'Currency'
          // filter: value => {
          //   return this.activeFilters.Currency
          //     ? this.activeFilters.Currency.includes(value)
          //     : true;
          // }
          // width: '120'
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
  mounted() {},
  methods: {
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
    editOpportunity(item) {
      this.setOppId(item.Id);
      this.setOpp(item);
      this.$router.push({ name: 'Edit Opportunity' });
      // console.log(item);
    },
    clearSearch() {
      this.searchStr = '';
    },
    initFilters() {
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
    },
    toggleAll(col) {
      this.activeFilters[col] = this.rows
        .map(d => {
          return d[col];
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
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
      return moment(date)
        .utc()
        .format(format);
    }
  }
};
</script>
