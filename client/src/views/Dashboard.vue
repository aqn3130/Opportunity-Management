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
                <v-card class="d-flex ml-auto mr-auto justify-center transparent" flat>
                    <v-data-table
                            :headers="headers"
                            :items="rows"
                            :items-per-page="5"
                            class="elevation-1 body-2 px-3"
                            :footer-props="{
                      showFirstLastPage: true,
                      firstIcon: 'mdi-arrow-collapse-left',
                      lastIcon: 'mdi-arrow-collapse-right',
                      prevIcon: 'mdi-minus',
                      nextIcon: 'mdi-plus'
                    }"
                    >
                        <template v-slot:item.OpportunityName="{ item }">
                            {{item.OpportunityName}}<br>{{ item.Country }}<br>{{item.Status}}
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
                rows: [
                    // {
                    //     name: 'Frozen Yogurt',
                    //     calories: 159,
                    //     fat: 6.0,
                    //     carbs: 24,
                    //     protein: 4.0,
                    //     iron: '1%',
                    // },
                    // {
                    //     name: 'Ice cream sandwich',
                    //     calories: 237,
                    //     fat: 9.0,
                    //     carbs: 37,
                    //     protein: 4.3,
                    //     iron: '1%',
                    // },
                    // {
                    //     name: 'Eclair',
                    //     calories: 262,
                    //     fat: 16.0,
                    //     carbs: 23,
                    //     protein: 6.0,
                    //     iron: '7%',
                    // },
                    // {
                    //     name: 'Cupcake',
                    //     calories: 305,
                    //     fat: 3.7,
                    //     carbs: 67,
                    //     protein: 4.3,
                    //     iron: '8%',
                    // },
                ],
                headers: [
                    {text: 'Opportunity Name', align: 'left', value: 'OpportunityName'},
                    {text: 'Country', align: 'left', value: 'Country'},
                    {text: 'Channel Type', align: 'left', value: 'ChannelType'},
                    {text: 'Status', align: 'left', value: 'Status'},
                    {text: 'License ID', align: 'left', value: 'LicenseID'},
                    {text: 'Expected Close Date', align: 'left', value: 'ExpectedCloseDate'},
                    {text: 'Currency', align: 'left', value: 'Currency'},
                    {text: 'Gross Value', align: 'left', value: 'GrossValue'},
                    // {
                    //     text: 'Dessert (100g serving)',
                    //     align: 'left',
                    //     value: 'name',
                    // },
                    // { text: 'Calories', align: 'left', value: 'calories' },
                    // { text: 'Fat (g)', align: 'left', value: 'fat' },
                    // { text: 'Carbs (g)', align: 'left', value: 'carbs' },
                    // { text: 'Protein (g)', align: 'left', value: 'protein' },
                    // { text: 'Iron (%)', align: 'left', value: 'iron' },
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
