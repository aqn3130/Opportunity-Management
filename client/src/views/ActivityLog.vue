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
        <v-container
          class="mb-10 py-5 px-16"
          style="z-index: 2; margin-top: -200px;"
        >
          <v-card class="d-flex justify-center px-5" flat color="#607d8b">
            <v-row>
              <v-col cols="12" class="mb-n5">
                <v-toolbar flat dense color="#607d8b">
                  <v-spacer></v-spacer>
                  <v-btn small text dark to="/activities"
                    ><v-icon class="mr-2" small>arrow_back</v-icon>
                    Back
                  </v-btn
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
                  height="287"
                  class="pa-3 mt-5 ml-2 overflow-auto"
                >
                  <span class="overline ml-2">Active Opportunities</span>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-item
                      v-for="(item, i) in currentCustomerOpts"
                      :key="i"
                    >
                      <!--                      <v-list-item-avatar>-->
                      <!--                        <v-icon>star</v-icon>-->
                      <!--                      </v-list-item-avatar>-->
                      <v-list-item-content>
                        <v-list-item-subtitle
                          class="tile text--primary"
                          align="left"
                        >
                          {{ item.OpportunityName }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="mr-2 pa-3">
                  <v-toolbar flat>
                    <v-toolbar-title class="body-2 text-uppercase">Note</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                      fab
                      right
                      small
                      color="#607D8B"
                      dark
                      @click="dialog = true"
                      ><v-icon>add</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <v-textarea
                    no-resize
                    v-model="activityLogNote"
                    @keyup.enter.prevent="saveNote"
                    :loading="noteSaveLoading"
                    :disabled="noteSaveLoading"
                    placeholder="Add a note and then press enter key on your keyboard to save it"
                    rows="2"
                  ></v-textarea>
                  <v-card-subtitle>Activity Timeline</v-card-subtitle>
                  <v-card height="500" flat class="overflow-auto pr-2">
                    <v-timeline dense v-for="a in allActivities" :key="a.id">
                      <v-timeline-item small right>
                        <template v-slot:icon>
                          <v-avatar size="36" v-if="a.Type === 'Meeting'">
                            <img src="../assets/calendar.png" />
                          </v-avatar>
                          <v-avatar size="36" v-if="a.Type === 'Note'">
                            <img src="../assets/note.png" />
                          </v-avatar>
                          <v-avatar
                            size="36"
                            v-if="a.Type === 'Phone Call'"
                            color="white"
                          >
                            <img src="../assets/phone.png" />
                          </v-avatar>
                        </template>
                        <v-card class="elevation-3">
                          <v-card-text class="white text--primary">
                            <div v-if="a.Type === 'Meeting'">
                              <v-layout
                                class="align-content-space-between d-flex"
                              >
                                <p>Logged a meeting with:</p>
                                <v-spacer></v-spacer>
                                <p>
                                  {{ a.created_at | convertDate }}
                                </p>
                              </v-layout>
                              <span v-if="a.ContactPerson">
                                {{ a.ContactPerson }}
                              </span>
                              <span v-else>
                                {{ 'Contact person not available' }}
                              </span>
                            </div>
                            <div v-if="a.Type === 'Note'">
                              <v-layout
                                class="align-content-space-between d-flex"
                              >
                                <p>Logged a note</p>
                                <v-spacer></v-spacer>
                                <p>
                                  {{ a.created_at | convertDate }}
                                </p>
                              </v-layout>
                              <div
                                class="overflow-auto"
                                :style="{ maxHeight: '50px' }"
                              >
                                {{ a.Note }}
                              </div>
                            </div>
                            <div v-if="a.Type === 'Phone Call'">
                              <v-layout
                                class="align-content-space-between d-flex"
                              >
                                <p>Logged a phone call with:</p>
                                <v-spacer></v-spacer>
                                <p>
                                  {{ a.created_at | convertDate }}
                                </p>
                              </v-layout>
                              <span v-if="a.ContactPerson">
                                {{ a.ContactPerson }}
                              </span>
                              <span v-else>
                                {{ 'Contact person not available' }}
                              </span>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card>
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
                  <v-text-field
                    disabled
                    v-model="currentActivity.CustomerName"
                    label="Customer Name"
                  ></v-text-field>
                  <v-text-field
                    v-show="false"
                    label="customer_id"
                    v-model="currentActivity.customer_id"
                  ></v-text-field>
                  <v-text-field
                    v-model="currentActivity.BPID"
                    label="BPID"
                    disabled
                  ></v-text-field>
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
                    :items="itemsCallBack"
                    :rules="[v => !!v || 'Item is required']"
                    label="Did you schedule a follow up during the activity?"
                    required
                  ></v-select>
                  <v-select
                    v-model="likelihood"
                    :items="itemsLikelihood"
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
      itemsCallBack: ['Yes', 'No'],
      itemsLikelihood: [
        '1 – Extremely Unlikely',
        '2 – Unlikely',
        '3 – Neutral',
        '4 – Likely',
        '5 – Extremely Likely'
      ],
      typeItems: ['Meeting', 'Phone Call'],
      checkbox: false,
      date: null,
      menu: false,
      calendarAltTxt: 'calendar image',
      noteAltTxt: 'note image',
      phoneAltTxt: 'phone image',
      allActivities: [],
      noteContent: {},
      phoneCallContent: {},
      meetingContent: {},
      currentCustomerOpts: [],
      activityLogNote: '',
      noteSaveLoading: false
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
    // if (!this.currentActivity) this.$router.push({ name: 'Login' });
  },
  computed: {
    ...mapState(['customers', 'currentActivity'])
  },
  async created() {
    // if (!this.currentActivity) this.$router.push({ name: 'Login' });
    await this.getRecords();
    await this.getCurrentCustomerOpts();
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
      // this.allActivities = _.uniqBy(this.allActivities, 'Type');
      // console.log(this.allActivities);
      // Object.keys(this.allActivities).forEach(key => {
      //   if (this.allActivities[key].Type === 'Phone Call') {
      //     this.phoneCallContent = this.allActivities[key];
      //   } else if (this.allActivities[key].Type === 'Note') {
      //     this.noteContent = this.allActivities[key];
      //   } else if (this.allActivities[key].Type === 'Meeting') {
      //     this.meetingContent = this.allActivities[key];
      //   }
      // });
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
          if (formLable === 'Customer Name') {
            formLable = 'CustomerName';
            formValue = this.$refs.form._data.inputs[i].value.CustomerName;
          }
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
        onClose: async () => {
          await this.getRecords();
          await this.getCurrentCustomerOpts();
        }
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
    },
    async getCurrentCustomerOpts() {
      await this.$store.dispatch('setCurrentTable', 'Opportunity');
      this.currentCustomerOpts = await this.$store.dispatch(
        'getCurrentCustomerOpts',
        this.currentActivity.CustomerName
      );
      // console.log(this.currentCustomerOpts);
    },
    async saveNote(e) {
      if (e.keyCode === 13 && this.activityLogNote) {
        const noteObj = {
          CustomerName: this.currentActivity.CustomerName,
          BPID: this.currentActivity.BPID,
          ActivityDate: this.formatDate(new Date().toISOString()),
          Type: 'Note',
          Note: this.activityLogNote,
          customer_id: this.currentActivity.customer_id
        };
        try {
          // this.currentActivity.Note = this.activityLogNote;
          // this.currentActivity.ActivityDate = this.formatDate(
          //   this.currentActivity.ActivityDate
          // );
          // console.log(noteObj);
          this.noteSaveLoading = true;
          await this.$store.dispatch('setCurrentTable', 'activities');
          await this.$store.dispatch('createRecord', noteObj);
          this.$toast.open({
            message: 'Note added',
            type: 'success',
            duration: 2000,
            dismissible: true,
            position: 'bottom',
            onClose: async () => {
              this.activityLogNote = '';
              await this.getRecords();
              await this.getCurrentCustomerOpts();
              this.noteSaveLoading = false;
            }
          });
        } catch (e) {
          console.log(e);
          this.$toast.open({
            message: 'Note add failed',
            type: 'error',
            duration: 2000,
            dismissible: true,
            position: 'bottom',
            onClose: () => {
              this.noteSaveLoading = false;
            }
          });
        }
      }
    },
    formatDate(date) {
      if (!date) return null;
      date = date.toString();
      const format = 'YYYY-MM-DD hh:mm:ss';
      return (
        moment(date, 'YYYY-MM-DD hh:mm:ss a')
          // .utc()
          .format(format)
      );
    }
  }
};
</script>

<style scoped></style>
