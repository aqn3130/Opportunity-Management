<template>
  <v-container>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
      <v-spacer></v-spacer>
      SPS
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      color="#ffffff"
      light
      :style="{ paddingLeft: '200px', paddingRight: '200px' }"
    >
      <v-form ref="spsForm" class="py-5" v-model="spsValid" lazy-validation>
        <v-select
          :items="valuePropositionDoc"
          v-model="vpd"
          label="Value Proposition Document"
        >
        </v-select>
        <v-select
          :items="productDemoStatus"
          v-model="pds"
          label="Product Demo Status"
        >
        </v-select>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          class="body-2"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="productDemoDate"
              label="Product Demo Date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
              class="body-2"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="productDemoDate"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
        <v-select
          :items="trialStatusItems"
          v-model="trialStatus"
          label="Trial Status"
        >
        </v-select>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          class="body-2"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="trialStartDate"
              label="Trial Start Date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
              class="body-2"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="trialStartDate"
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
        <v-menu
          v-model="menu3"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          class="body-2"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="trialEndDate"
              label="Trial End Date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
              class="body-2"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="trialEndDate"
            @input="menu3 = false"
          ></v-date-picker>
        </v-menu>
        <v-text-field
          v-model="NoRL"
          label="Number Of Recommendation Letters"
          :rules="NoRLRule"
        ></v-text-field>
<!--        <v-text-field v-model="NoRLComment" label="NoRL Comment"></v-text-field>-->
      </v-form>
      <v-card-actions>
        <v-btn @click="saveSPS" class="mb-5" color="#455A64" :disabled="!spsValid" v-if="!spsValid">Update</v-btn>
        <v-btn @click="saveSPS" class="mb-5" color="#455A64" dark v-else>Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SPS',
  data: () => ({
    spsValid: true,
    vpd: null,
    pds: null,
    valuePropositionDoc: ['Not Needed', 'Scheduled', 'WIP', 'Delivered'],
    productDemoStatus: ['Not Needed', 'Scheduled', 'WIP', 'Delivered'],
    menu: false,
    menu2: false,
    menu3: false,
    productDemoDate: null,
    trialStatusItems: ['Not Needed', 'Scheduled', 'Active', 'Complete'],
    trialStatus: null,
    trialStartDate: null,
    trialEndDate: null,
    NoRL: null,
    NoRLComment: null,
    NoRLRule: [v => /^[0-9]+$/.test(v) || 'Numeric values only']
  }),
  computed: {
    ...mapState(['opportunityId', 'opportunity'])
  },
  created() {
    this.vpd = this.opportunity.ValuePropositionDocument;
    this.pds = this.opportunity.ProductDemoStatus;
    this.productDemoDate = this.opportunity.ProductDemoDate;
    this.trialStatus = this.opportunity.TrialStatus;
    this.trialStartDate = this.opportunity.TrialStartDate;
    this.trialEndDate = this.opportunity.TrialEndDate;
    this.NoRL = this.opportunity.NumberOfRecommendationLetters;
  },
  methods: {
    getFormData() {
      const data_map = new Map();
      for (let i in this.$refs.spsForm._data.inputs) {
        let formLable = this.$refs.spsForm._data.inputs[i].label
          .replace('*', '')
          .replace(/ /g, '')
          .trim();
        let formValue = this.$refs.spsForm._data.inputs[i].value;
        data_map.set(formLable, formValue);
      }
      data_map.set('id', this.opportunityId);
      return Object.fromEntries(data_map);
    },
    async saveSPS() {
      const data = this.getFormData();
      try {
        await this.$store.dispatch('setCurrentTable', 'Opportunity');
        await this.$store.dispatch('updateRecord', data);
        // console.log(data);
        this.$toast.open({
          message: 'Opportunity Updated',
          type: 'success',
          duration: 2000,
          dismissible: true,
          position: 'bottom',
          onClose: () => {
            // window.BUS.$emit('sps-updated');
            // this.$router.push({ name: 'Dashboard' });
          }
        });
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: 'Opportunity updated failed, please contact your system admin',
          type: 'error',
          duration: 2000,
          dismissible: true,
          position: 'bottom',
          onClose: () => {
            // window.BUS.$emit('sps-updated');
            // this.$router.push({ name: 'Dashboard' });
          }
        });
      }
    }
  }
};
</script>

<style scoped></style>
