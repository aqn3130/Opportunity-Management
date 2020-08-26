<!--<template>-->
<!--    <v-container fluid>-->
<!--        <v-card>-->
<!--            <v-card-title class="grey lighten-3">-->
<!--                Region Assigned VP-->
<!--                <v-spacer></v-spacer>-->
<!--                <v-text-field-->
<!--                        v-model="search"-->
<!--                        append-icon="search"-->
<!--                        label="Search"-->
<!--                        single-line-->
<!--                        hide-details-->
<!--                        clearable-->
<!--                        solo-->
<!--                        outlined-->
<!--                        dense-->
<!--                        flat-->
<!--                ></v-text-field>-->
<!--            </v-card-title>-->
<!--            <v-data-table-->
<!--                    :headers="headers"-->
<!--                    :items="rows"-->
<!--                    :items-per-page="5"-->
<!--                    class="elevation-1"-->
<!--                    :search="search"-->
<!--                    :loading="loading"-->
<!--                    loading-text="Retrieving data..."-->
<!--            ></v-data-table>-->
<!--        </v-card>-->
<!--    </v-container>-->
<!--</template>-->
<template>
    <v-container fluid>
        <v-data-table
                :headers="headers"
                :items="rows"
                :items-per-page="5"
                class="elevation-1"
                :search="search"
                v-model="selected"
                :loading="loading"
                loading-text="Retrieving data..."
                :footer-props="{
                      showFirstLastPage: true,
                      firstIcon: 'mdi-arrow-collapse-left',
                      lastIcon: 'mdi-arrow-collapse-right',
                      prevIcon: 'mdi-minus',
                      nextIcon: 'mdi-plus'
                    }"
        >
            <template v-slot:top>
                <v-toolbar flat color="grey lighten-3">
                    <v-toolbar-title>
                        Region Assigned VP
                    </v-toolbar-title>

                    <v-spacer></v-spacer>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            clearable
                            solo
                            outlined
                            dense
                            flat
                    ></v-text-field>

                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['RegionChannel']" label="Region Channel"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Region_Key']" label="Region Key"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Region']" label="Region"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Channel Type_key']" label="Channel Type_key"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Channel Type']" label="Channel Type"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Vice President_Key']" label="Vice President_Key"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Vice President']" label="Vice President"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-divider
                        class="mb-2 purple"
                ></v-divider>
            </template>
            <template v-slot:item.action="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    edit
                </v-icon>
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    delete
                </v-icon>
            </template>
            <!--            <template v-slot:no-data>-->
            <!--                <v-btn color="primary" @click="initialize">Reset</v-btn>-->
            <!--            </template>-->
        </v-data-table>
    </v-container>
</template>
<script>
    import { mapState } from 'vuex';
    export default {
        name: 'RegionAssignedVP',
        components: {
        },
        data () {
            return {
                headers: [
                    { text: 'Region Channel', value: 'RegionChannel' },
                    { text: 'Region Key', value: 'Region_Key' },
                    {
                        text: 'Region',
                        align: 'left',
                        sortable: true,
                        value: 'Region',

                    },
                    { text: 'Channel Type_key', value: 'Channel Type_key' },
                    { text: 'Channel Type', value: 'Channel Type' },
                    { text: 'Vice President_Key', value: 'Vice President_Key' },
                    { text: 'Vice President', value: 'Vice President' },
                    {text: 'Actions', value: 'action'}
                ],
                rows: [],
                search:'',
                selected:  [],
                dialog: false,
                editedItem: {
                },
                defaultItem: {
                    ['RegionChannel']: '',
                    ['Region_Key']: '',
                    ['Region']: '',
                    ['Channel Type_key']: '',
                    ['Channel Type']: '',
                    ['Vice President_Key']: '',
                    ['Vice President']: ''
                },
                editedIndex: -1,
            }
        },
        async created() {
            await this.$store.dispatch('setCurrentTable', 'region_assigned_vp')
            this.rows = await this.$store.dispatch('getRecords');
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
        },
        methods: {
            getRecords: async function () {
                const data = await this.$store.dispatch('getRecords');
                this.rows = data;
            },
            editItem (item) {
                this.editedIndex = this.rows.indexOf(item);
                this.editedItem = item;
                // console.log(this.editedItem);
                this.dialog = true
            },
            async deleteItem (item) {
                await this.$store.dispatch('deleteRecord', item.id);
                await this.getRecords();

            },
            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            async save () {
                if ( this.editedIndex === -1 ){
                    await this.$store.dispatch('createRecord',this.editedItem);
                }else {
                    await this.$store.dispatch('updateRecord', this.editedItem);
                }
                await this.getRecords();
                this.close()
            },
        },
        computed: {
            ...mapState([
                "loading"
            ]),
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        }
    }
</script>