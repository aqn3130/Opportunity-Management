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
            <v-card-text class="text-center overline">
            </v-card-text>
        </v-card>
        <v-layout>
            <v-container class="mb-10 pa-5" style="z-index: 2; margin-top: -150px;">
                <v-card class="d-flex ml-auto mr-auto justify-center transparent" flat width="auto">
                    <v-data-table
                            :headers="headers"
                            :items="rows"
                            :items-per-page="5"
                            class="elevation-1 px-3"
                            :footer-props="{
                              showFirstLastPage: true,
                              firstIcon: 'mdi-arrow-collapse-left',
                              lastIcon: 'mdi-arrow-collapse-right',
                              prevIcon: 'mdi-minus',
                              nextIcon: 'mdi-plus'
                            }"
                    >
                        <template v-slot:item.OpportunityName="{ item }">
                            <span style="font-size: small; font-weight: bold;">
                                {{item.OpportunityName}}
                            </span><br>
                            <span style="font-size: small">
                            {{ item.SalesStage }}<br>
                            </span>
                            <span style="font-size: small; max-width: 200px" class="text-truncate d-inline-block">
                            {{item.CustomerName}}-{{item.BPID}}
                            </span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
        </v-layout>
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'dashboard',
        components: {

        },
        data() {
            return {
                rows: [],
                headers: [
                    {text: 'Opportunity Name', align: 'left', value: 'OpportunityName'},
                    {text: 'Country', align: 'left', value: 'Country'},
                    {text: 'Channel Type', align: 'left', value: 'ChannelType'},
                    {text: 'Status', align: 'left', value: 'Status'},
                    {text: 'License ID', align: 'left', value: 'LicenseID'},
                    {text: 'Expected Close Date', align: 'left', value: 'ExpectedCloseDate'},
                    {text: 'Currency', align: 'left', value: 'Currency'},
                    {text: 'Gross Value', align: 'left', value: 'GrossValue'},
                ]
            }
        },
        async created() {
            await this.$store.dispatch('setCurrentTable','Opportunity')
            await this.getRecords();
        },
        methods: {
            getRecords: async function () {
                const data = await this.$store.dispatch('getRecords', '');
                this.rows = data;
            },
            getRecord: async function () {
                const data = await this.$store.dispatch('getRecords', 1);
                this.rows = data;
            },
        }
    }
</script>
