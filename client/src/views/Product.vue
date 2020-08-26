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
                        Product
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
                                            <v-text-field v-model="editedItem['Category ID']" label="Category ID"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['CRM_Source']" label="CRM_Source"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Category_Description']" label="Category_Description"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Title_Category']" label="Title_Category"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem['Product_Group_Category']" label="Product_Group_Category"></v-text-field>
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
        </v-data-table>
    </v-container>
</template>
<script>
    import { mapState } from 'vuex';
    import Navbar from "../components/Navbar";
    export default {
        name: 'product',
        components:{
            Navbar
        },
        data () {
            return {
                headers: [
                    {
                        text: 'Category ID',
                        align: 'left',
                        sortable: true,
                        value: 'Category ID',
                    },
                    {text: 'CRM_Source', value: 'CRM_Source'},
                    {text: 'Category_Description', value: 'Category_Description'},
                    {text: 'Title_Category', value: 'Title_Category'},
                    {text: 'Product_Group_Category', value: 'Product_Group_Category'},
                    // {text: 'Updated_at', value: 'updated_at'},
                    {text: 'Actions', value: 'action'},
                ],
                rows: [],
                newRec: [],
                search:'',
                dialog: false,
                editedItem: {
                },
                defaultItem: {
                    ['Category ID']: '',
                    ['CRM_Source']: '',
                    ['Category_Description']: '',
                    ['Title_Category']: '',
                    ['Product_Group_Category']: ''
                },
                editedIndex: -1,
                selected:  []
            }
        },
        async created() {
            await this.$store.dispatch('setCurrentTable', 'products');
            await this.getRecords();
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
            ...mapState([
                "loading"
            ])
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
        }
    }
</script>