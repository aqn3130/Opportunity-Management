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
        <v-card class="d-flex justify-center transparent mt-n10" flat>
          <v-row>
            <v-col>
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
</template>

<script>
import moment from 'moment';
import {mapMutations, mapState} from 'vuex';

export default {
  name: 'ActivityLog',
  data() {
    return {
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
  computed: {
    ...mapState(['customers'])
  },
  methods: {
    ...mapMutations({
      setRelation: 'setRelation'
    }),
    getRecords: async function() {
    },
    ...mapMutations({
      setSearchStr: 'setSearchStr',
      setFilter: 'setFilter',
      setCurrentActivity: 'setCurrentActivity'
    }),
    editActivity() {
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
    }
  }
};
</script>

<style scoped></style>
