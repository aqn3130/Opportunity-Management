<template>
  <v-container fluid>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2">
      <v-spacer></v-spacer>
      New Note
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card
      tile
      color="#ffffff"
      light
      :style="{ paddingLeft: '200px', paddingRight: '200px' }"
    >
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row style="padding: 15px 20px 25px 20px">
          <v-col md="12">
            <v-text-field
              v-model="note"
              label="New Note"
              class="body-2"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2">
      <v-spacer></v-spacer>
      Notes
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile :style="{ paddingLeft: '200px', paddingRight: '200px' }">
      <v-list dense>
        <v-list-item-group v-model="notes" color="primary">
          <v-list-item v-for="item in notes" :key="item.id">
            <v-list-item-content :style="{ minWidth: '600px' }">
              <v-textarea
                v-model="item.Message"
                label="Note"
                class="body-2"
                rows="2"
                no-resize
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content class="mb-lg-10 ml-5">
              <span class="body-2">Create Date</span>
              {{ item.CreateDate | formatDate }}
            </v-list-item-content>
            <v-btn icon small @click="deleteProduct(item)">
              <v-icon small>delete</v-icon>
            </v-btn>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'Notes',
  data() {
    return {
      note: null,
      notes: [],
      valid: true
    };
  },
  computed: {
    ...mapState(['opportunityId'])
  },
  filters: {
    formatDate(date) {
      if (!date) return '';
      date = date.toString();
      const format = 'YYYY-MM-DD';
      return moment(date)
        .utc()
        .format(format);
    }
  },
  async created() {
    await this.$store.dispatch('setCurrentTable', 'Note');
    this.notes = await this.$store.dispatch('getRecords', this.opportunityId);
    // console.log(this.notes);
  },
  methods: {
    deleteProduct(item) {
      console.log(item);
    }
  }
};
</script>

<style scoped></style>
