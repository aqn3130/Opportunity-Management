<template>
  <v-container fluid>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
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
              label="Add Note"
              class="body-2"
              @keyup="addNote"
              placeholder="Write your notes here and then press on Enter key to save it"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-toolbar color="#455A64" height="30" dark class="subtitle-2" flat>
      <v-spacer></v-spacer>
      Notes
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile :style="{ paddingLeft: '200px', paddingRight: '200px' }">
      <v-list>
        <v-list-item v-for="(item, i) in notes" :key="i">
          <v-list-item-content :style="{ minWidth: '600px' }">
            <v-textarea
              v-model="item.Message"
              label="Note"
              class="body-2"
              rows="2"
              no-resize
              @blur="onNoteChange(item)"
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
      </v-list>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'Notes',
  data: () => ({
    note: null,
    notes: [],
    valid: true
  }),
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
    await this.init();
    // console.log(this.notes);
  },
  methods: {
    async init() {
      await this.$store.dispatch('setCurrentTable', 'Note');
      this.notes = await this.$store.dispatch('getRecords', this.opportunityId);
    },
    async deleteProduct(item) {
      await this.$store.dispatch('setCurrentTable', 'Note');
      try {
        await this.$store.dispatch('deleteRecord', item.Id);
        await this.init();
        this.$toast.open({
          message: 'Note Deleted',
          type: 'success',
          duration: 2000,
          dismissible: true,
          position: 'bottom'
          // onClose: () => {
          // this.getProducts();
          // }
        });
      } catch (e) {
        this.$toast.open({
          message: 'Note deletion failed, please contact your system admin',
          type: 'error',
          duration: 2000,
          dismissible: true,
          position: 'bottom'
          // onClose: () => {
          // this.getProducts();
          // }
        });
      }
    },
    async onNoteChange(note) {
      const format = 'YYYY-MM-DD HH:mm:ss';
      const formattedDate = moment(note.CreateDate).format(format);
      note.CreateDate = formattedDate;
      // console.log('here', note);
      await this.$store.dispatch('setCurrentTable', 'Note');
      await this.$store.dispatch('updateRecord', note);
    },
    isDuplicate(note, notes) {
      let isDuplicate = false;
      Object.keys(notes).forEach(key => {
        if (notes[key].Message === note) {
          isDuplicate = true;
          this.$toast.open({
            message: 'Note exists',
            type: 'info',
            duration: 2000,
            dismissible: true,
            position: 'bottom'
            // onClose: () => {
            // this.getProducts();
            // }
          });
        }
      });
      return isDuplicate;
    },
    async addNote(e) {
      const createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const newNote = {
        CreateDate: createDate,
        Message: this.note,
        Opportunity_fk: this.opportunityId
      };
      await this.init();
      const isDuplicate = this.isDuplicate(newNote.Message, this.notes);
      await this.$store.dispatch('setCurrentTable', 'Note');
      if (e.keyCode === 13 && newNote.Message && !isDuplicate) {
        try {
          await this.$store.dispatch('createRecord', newNote);
          await this.init();
          this.note = null;
          this.$toast.open({
            message: 'Note Added',
            type: 'success',
            duration: 2000,
            dismissible: true,
            position: 'bottom'
            // onClose: () => {
            // this.getProducts();
            // }
          });
        } catch (e) {
          this.$toast.open({
            message: 'Adding new note failed, please contact your system admin',
            type: 'error',
            duration: 2000,
            dismissible: true,
            position: 'bottom'
            // onClose: () => {
            // this.getProducts();
            // }
          });
        }
      }
    }
  }
};
</script>

<style scoped></style>
