<template>
  <v-container fluid>
    <v-toolbar color="#455A64" height="30" dark class="overline" flat>
      <v-spacer></v-spacer>
      New Note
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile color="#ffffff" light :style="{ border: '1px solid #455A64' }">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row style="padding: 15px 90px 25px 20px">
          <v-col md="12">
            <v-text-field
              v-model="note"
              label="Add Note"
              class="body-2"
              placeholder="Write your notes here and then press on Enter key to save it"
              v-on:keydown.enter.prevent="addNote"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-toolbar color="#455A64" height="30" dark class="overline" flat>
      <v-spacer></v-spacer>
      Notes
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card tile :style="{ border: '1px solid #455A64' }">
      <v-list dense>
        <v-list-item-group v-model="selectedNote" color="primary">
          <v-list-item v-for="(item, i) in notes" :key="i">
            <v-row dense class="px-2">
              <v-col md="10" class="pr-5">
                <v-list-item-subtitle>
                  Note
                </v-list-item-subtitle>
                <v-list-item-content>
                  <v-textarea
                    v-model="item.Message"
                    class="body-2"
                    rows="1"
                    no-resize
                    @blur="onNoteChange(item)"
                    dense
                  ></v-textarea>
                </v-list-item-content>
              </v-col>
              <v-col md="2">
                <v-list-item-subtitle>
                  Created Date
                </v-list-item-subtitle>
                <v-list-item-content>
                  <div class="caption">
                    {{ item.CreateDate | formatDate }}
                    <v-btn icon small @click="deleteProduct(item)" class="ml-5">
                      <v-icon small>delete</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-col>
            </v-row>
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
  data: () => ({
    note: null,
    notes: [],
    valid: true,
    selectedNote: 1
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
          position: 'bottom',
          queue: true
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
            position: 'bottom',
            queue: true
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
            position: 'bottom',
            queue: true
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
