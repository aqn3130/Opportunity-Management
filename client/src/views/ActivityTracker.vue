<template>
  <div>
    <div v-if="rows">
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
        <v-container class="mb-10 pa-5" style="z-index: 2; margin-top: -100px;">
          <v-card class="d-flex justify-center transparent mt-n10" flat>
            <v-row>
              <v-col>
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
                  @click:row="editActivity"
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
                  <template v-slot:item.ActivityDate="{ item }">
                    <span class="caption">
                      {{ item.ActivityDate | convertDate }}
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
        class="mb-16 mr-1"
        link
        @click="dialog = true"
        fixed
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialog" width="600px" persistent>
          <v-card tile>
            <v-toolbar color="#455A64" height="40" flat dark
              >Log Activity</v-toolbar
            >
            <template>
              <v-form ref="form" v-model="valid" lazy-validation class="pa-10">
                <v-card class="px-15" flat>
                  <v-select
                    v-model="customerName"
                    :hint="`${customerName.CustomerName}, ${customerName.id}`"
                    :rules="nameRules"
                    label="Customer Name"
                    :items="customers"
                    item-text="CustomerName"
                    item-value="id"
                    required
                    return-object
                  ></v-select>
                  <v-text-field
                    v-show="false"
                    label="customer_id"
                    v-model="customerName"
                  ></v-text-field>
                  <v-text-field v-model="BPID" label="BPID"></v-text-field>
                  <v-select
                    v-model="type"
                    :items="typeItems"
                    :rules="[v => !!v || 'This field is required']"
                    label="Activity"
                    required
                  ></v-select>
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
                        label="Activity Date"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        :rules="nameRules"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                    v-model="contactPerson"
                    label="Who did you communicate with?"
                  ></v-text-field>
                  <v-select
                    v-model="followUpMeeting"
                    :items="items"
                    :rules="[v => !!v || 'Item is required']"
                    label="Did you schedule a follow up during the activity?"
                    required
                  ></v-select>
                  <v-select
                    v-model="likelihood"
                    :items="items"
                    :rules="[v => !!v || 'Item is required']"
                    label="How did you feel after the activity?"
                    required
                  ></v-select>
                </v-card>
                <!--              <v-card-subtitle>Note</v-card-subtitle>-->
                <!--              <v-divider class="black"></v-divider>-->
                <v-textarea
                  v-model="note"
                  placeholder="Leave a note..."
                  no-resize
                  label="Note"
                  outlined
                  class="mt-5"
                ></v-textarea>
              </v-form>
            </template>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#455A64" @click="validate" :disabled="!valid" text>
                Save
              </v-btn>
              <v-btn color="#455A64" @click="reset" text class="mr-8">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
    <div v-else>
      <v-dialog v-model="sessionEndedDialog" width="400">
        <v-card width="400">
          <v-card-text class="py-10"
            >Your session ended, please log back in</v-card-text
          >
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn text @click="goToLoginPage">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapMutations, mapState } from 'vuex';
const _ = require('lodash');

export default {
  name: 'ActivityTracker',
  components: {},
  data() {
    return {
      rows: [],
      searchStr: '',
      page: 0,
      perPage: 5,
      totalLeads: 0,
      options: {},
      dialog: false,
      valid: true,
      customerName: {},
      BPID: '',
      followUpMeeting: '',
      likelihood: '',
      note: '',
      type: '',
      nameRules: [v => !!v || 'This field is required'],
      contactPerson: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      typeItems: ['Meeting', 'Phone Call', 'Note'],
      checkbox: false,
      date: null,
      menu: false,
      customers: [],
      sessionEndedDialog: true
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
  async created() {},
  computed: {
    headers() {
      return [
        { text: 'Customer Name', align: 'left', value: 'CustomerName' },
        { text: 'BPID', align: 'left', value: 'BPID' },
        { text: 'Last Activity', align: 'left', value: 'Type' },
        { text: 'Last Activity Date', align: 'left', value: 'ActivityDate' }
      ];
    },
    ...mapState(['loading', 'currentActivity'])
  },
  watch: {
    options: {
      handler() {
        this.setSearchStr(this.searchStr);
        this.getDataFromApi().then(data => {
          this.rows = data.items;
          this.totalLeads = data.total;
        });
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setRelation: 'setRelation',
      setCustomers: 'setCustomers'
    }),
    ...mapActions('auth', ['logout']),
    getRecords: async function() {
      this.setRelation('activities');
      await this.$store.dispatch('setCurrentTable', 'customers');
      const allActivities = await this.$store.dispatch('getRecords', '');
      const uniq_activities = _.uniqBy(allActivities.opts, 'CustomerName');
      // console.log(uniq_activities);
      allActivities.opts = uniq_activities;
      allActivities.totalOpts = uniq_activities.length;
      this.customers = allActivities.customers;
      this.setCustomers(this.customers);
      return allActivities;
    },
    ...mapMutations({
      setOppId: 'setOppId',
      setOpp: 'setOpp',
      setPage: 'setPage',
      setPerPage: 'setPerPage',
      setSearchStr: 'setSearchStr',
      setFilter: 'setFilter',
      setCurrentActivity: 'setCurrentActivity'
    }),
    editActivity(currentActivity) {
      this.searchStr = '';
      this.setSearchStr(this.searchStr);
      this.setCurrentActivity(currentActivity);
      this.$router.push({ name: 'Activity Log' });
      // console.log(currentActivity);
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
    getFormData() {
      const data_map = new Map();
      for (let i in this.$refs.form._data.inputs) {
        if (this.$refs.form._data.inputs.hasOwnProperty(i)) {
          let formLable = this.$refs.form._data.inputs[i].label
            .replace('*', '')
            .replace(/ /g, '')
            .trim();
          if (formLable === 'Didyouscheduleafollowupduringtheactivity?')
            formLable = 'FollowUpMeeting';
          if (formLable === 'Howdidyoufeelaftertheactivity?')
            formLable = 'Likelihood';
          if (formLable === 'Whodidyoucommunicatewith?')
            formLable = 'ContactPerson';
          if (formLable === 'Activity') formLable = 'Type';
          let formValue = this.$refs.form._data.inputs[i].value;
          if (formLable === 'CustomerName') {
            formValue = this.$refs.form._data.inputs[i].value.CustomerName;
          }
          if (formLable === 'customer_id')
            formValue = this.$refs.form._data.inputs[i].value.id;
          data_map.set(formLable, formValue);
        }
      }
      return Object.fromEntries(data_map);
    },
    async saveActivity(activity) {
      await this.$store.dispatch('setCurrentTable', 'activities');
      await this.$store.dispatch('createRecord', activity);
      this.getDataFromApi().then(data => {
        this.rows = data.items;
        this.totalLeads = data.total;
        // console.log(data);
      });
      this.reset();
      this.$toast.open({
        message: 'Activity Saved',
        type: 'success',
        duration: 2000,
        dismissible: true,
        position: 'bottom',
        onClose: () => {}
      });
      // console.log(activity);
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.saveActivity(this.getFormData());
      }
    },
    reset() {
      this.customerName = {};
      this.BPID = '';
      this.followUpMeeting = '';
      this.likelihood = '';
      this.note = '';
      this.type = '';
      this.contactPerson = '';
      this.dialog = false;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    goToLoginPage() {
      this.sessionEndedDialog = false;
      this.logout();
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped></style>
