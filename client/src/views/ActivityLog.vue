<template>
  <div>
    <div v-if="Object.keys(currentActivity).length">
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
          <v-card class="d-flex justify-center mt-n10" flat>
            <v-row>
              <v-col cols="12">
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-btn small color="#607D8B" dark to="/activities"
                    >Back</v-btn
                  >
                </v-toolbar>
              </v-col>
              <v-col cols="4">
                <v-card width="auto" height="200" class="py-10 ml-2">
                  <v-img
                    height="70"
                    width="60"
                    src="../assets/customer_img.png"
                    class="ml-auto mr-auto"
                  ></v-img>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="tile" align="center">
                        {{ currentActivity.CustomerName }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="tile" align="center">
                        {{ currentActivity.BPID }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <v-card
                  width="auto"
                  min-height="287"
                  max-height="287"
                  class="pa-3 mt-5 ml-2"
                >
                  <span class="overline ml-2">Active Opportunities</span>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="tile" align="center">
                        {{ 'to be implemented' }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="tile" align="center">
                        {{ '' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="mr-2 pa-3">
                  <v-toolbar flat>
                    <v-toolbar-title>Note</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn fab right small color="#607D8B" dark
                      ><v-icon>add</v-icon></v-btn
                    >
                  </v-toolbar>
                  <v-divider></v-divider>
                  <v-textarea no-resize></v-textarea>
                  <v-card-subtitle>Activity Timeline</v-card-subtitle>
                  <v-timeline dense>
                    <v-timeline-item small right>
                      <template v-slot:icon>
                        <v-avatar size="36">
                          <img src="../assets/calendar.png" />
                        </v-avatar>
                      </template>
                      <v-card class="elevation-2">
                        <v-card-text>
                          <v-layout class="align-content-space-between d-flex">
                            <p class="caption">Logged a meeting with:</p>
                            <v-spacer></v-spacer>
                            <p class="caption">
                              {{ meetingContent.created_at | convertDate }}
                            </p>
                          </v-layout>
                          <span
                            class="caption font-weight-black"
                            v-if="currentActivity.ContactPerson"
                          >
                            {{ currentActivity.ContactPerson }}
                          </span>
                          <span class="caption font-weight-black" v-else>
                            {{ 'Contact person not available' }}
                          </span>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                    <v-timeline-item small right>
                      <template v-slot:icon>
                        <v-avatar size="36">
                          <img src="../assets/note.png" />
                        </v-avatar>
                      </template>
                      <v-card class="elevation-2">
                        <v-card-text>
                          <v-layout class="align-content-space-between d-flex">
                            <p class="caption">Logged a note</p>
                            <v-spacer></v-spacer>
                            <p class="caption">
                              {{ noteContent.created_at | convertDate }}
                            </p>
                          </v-layout>
                          <div
                            class="caption overflow-auto font-weight-black"
                            :style="{ maxHeight: '50px' }"
                          >
                            {{ noteContent.Note }}
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                    <v-timeline-item small right>
                      <template v-slot:icon>
                        <v-avatar color="white" size="36">
                          <img src="../assets/phone.png" />
                        </v-avatar>
                      </template>
                      <v-card class="elevation-2">
                        <v-card-text>
                          <v-layout class="align-content-space-between d-flex">
                            <p class="caption">Logged a phone call with:</p>
                            <v-spacer></v-spacer>
                            <p class="caption">
                              {{ phoneCallContent.created_at | convertDate }}
                            </p>
                          </v-layout>
                          <span
                            class="caption font-weight-black"
                            v-if="currentActivity.ContactPerson"
                          >
                            {{ currentActivity.ContactPerson }}
                          </span>
                          <span class="caption font-weight-black" v-else>
                            {{ 'Contact person not available' }}
                          </span>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-layout>
      <v-btn
        absolute
        dark
        fab
        top
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

export default {
  name: 'ActivityLog',
  data() {
    return {
      sessionEndedDialog: true,
      searchStr: '',
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
      calendarAltTxt: 'calendar image',
      noteAltTxt: 'note image',
      phoneAltTxt: 'phone image',
      allActivities: [],
      noteContent: {},
      phoneCallContent: {},
      meetingContent: {}
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
  mounted() {
    if (!this.currentActivity) this.$router.push({ name: 'Login' });
  },
  computed: {
    ...mapState(['customers', 'currentActivity'])
  },
  created() {
    if (!this.currentActivity) this.$router.push({ name: 'Login' });
    this.getRecords();
  },
  methods: {
    ...mapMutations({
      setRelation: 'setRelation'
    }),
    ...mapActions('auth', ['login', 'logout']),
    getRecords: async function() {
      await this.$store.dispatch('setCurrentTable', 'customers');
      this.allActivities = await this.$store.dispatch(
        'getRecords',
        this.currentActivity.customer_id
      );
      // console.log(this.allActivities);
      this.allActivities = _.uniqBy(this.allActivities, 'Type');
      // console.log(this.allActivities);
      Object.keys(this.allActivities).forEach(key => {
        if (this.allActivities[key].Type === 'Phone Call') {
          this.phoneCallContent = this.allActivities[key];
        } else if (this.allActivities[key].Type === 'Note') {
          this.noteContent = this.allActivities[key];
        } else if (this.allActivities[key].Type === 'Meeting') {
          this.meetingContent = this.allActivities[key];
        }
      });
    },
    ...mapMutations({
      setSearchStr: 'setSearchStr',
      setFilter: 'setFilter',
      setCurrentActivity: 'setCurrentActivity'
    }),
    editActivity() {},
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
