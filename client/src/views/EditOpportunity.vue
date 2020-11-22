<template>
  <v-container>
    <v-card color="#eceff1" flat class="mt-n14">
      <v-tabs
        v-model="tab"
        background-color="transparent"
        class="ml-3"
        slider-size="1"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#tab-1" class="mb-n5 overline">
          Opportunity
        </v-tab>

        <v-tab href="#tab-2" class="mb-n5 overline">
          Notes
        </v-tab>

        <v-tab href="#tab-3" v-if="opportunity.Type === 'SPS'" class="mb-n5 overline">
          SPS
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <v-card flat color="#eceff1">
            <EditOpp />
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat color="#eceff1">
            <Notes />
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-3">
          <v-card flat color="#eceff1">
            <SPS />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
import EditOpp from '../components/EditOpp';
import Notes from '../components/Notes';
import SPS from '../components/SPS';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'EditOpportunity',
  components: { EditOpp, Notes, SPS },
  data() {
    return {
      tab: null,
      containerWidth: '1350px'
    };
  },
  computed: {
    ...mapState(['openedTab', 'opportunity', 'loading'])
  },
  created() {
    if (!this.opportunity) this.$router.push({ name: 'Dashboard' });
    this.openedTab;
    // window.BUS.$on('sps-updated', () => {})
  },
  methods: {
    ...mapMutations({
      setTab: 'setTab'
    })
  }
};
</script>
