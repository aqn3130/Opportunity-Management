<template>
    <v-container fluid>
        <template>
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
                            Material Code
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
                                                <v-text-field v-model="editedItem['Material Code']" label="Material Code"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Journal title number']" label="Journal title number"></v-text-field>
                                            </v-col>
                                            <!--                                        <v-col cols="12" sm="6" md="4">-->
                                            <!--                                            <v-text-field v-model="editedItem['Backfile Flag']" label="Backfile Flag"></v-text-field>-->
                                            <!--                                        </v-col>-->
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Title Category']" label="Title Category"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Product Group Code']" label="Product Group Code"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Order_Category']" label="Order_Category"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Inprint']" label="Inprint"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem['Finance Category']" label="Finance Category"></v-text-field>
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
        </template>

<!--        <DataTable-->
<!--                :newRec="newRec"-->
<!--                :save="save"-->
<!--                :title="title"-->
<!--                :headers="headers"-->
<!--                :items="mCode"-->
<!--                :formTitle="formTitle"-->
<!--                :defaultItem="defaultItem"-->
<!--                :editedItem="editedItem"-->
<!--                :close="close"-->
<!--                :editItem="editItem"-->
<!--                :deleteItem="deleteItem"-->
<!--                :isOpen="idialog"-->
<!--        />-->
    </v-container>
</template>
<script>
    import Navbar from '../components/Navbar';
    import DataTable from "../components/DataTable";
    import { mapState } from 'vuex';
    export default {
        name: 'MaterialCode',
        components: {
            Navbar,
            DataTable
        },
        data () {
            return {
                headers: [
                    {
                        text: 'Material Code',
                        align: 'left',
                        sortable: true,
                        value: 'Material Code',
                    },
                    { text: 'Journal title number', value: 'Journal title number' },
                    // { text: 'Delivery Type', value: 'Delivery Type' },
                    // { text: 'Backfile Flag', value: 'Backfile Flag' },
                    { text: 'Title Category', value: 'Title Category' },
                    { text: 'Product Group Code', value: 'Product Group Code' },
                    { text: 'Order_Category', value: 'Order_Category' },
                    { text: 'Inprint', value: 'Inprint' },
                    { text: 'Finance Category', value: 'Finance Category' },
                    { text: 'Actions', value: 'action', sortable: false },
                ],
                rows: [],
                newRec: [],
                search:'',
                dialog: false,
                editedItem: {
                },
                defaultItem: {
                    ['Material Code']: '',
                    ['Journal title number']: '',
                    // ['Delivery Type']: '',
                    // ['Backfile Flag']: '',
                    ['Title Category']: '',
                    ['Product Group Code']: '',
                    ['Order_Category']: '',
                    ['Inprint']: '',
                    ['Finance Category']: ''
                },
                editedIndex: -1,
                selected:  [],
                title: 'Material Code',
            }
        },
        async created() {
            await this.$store.dispatch('setCurrentTable','materialcode');
            await this.getRecords();
        },
        watch: {
            dialog (val) {
                val || this.close();
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
                this.rows = await this.$store.dispatch('getRecords');
                // const data = await this.$store.dispatch('get_all_material_codes');
                // this.mCode = data;
            },
            editItem (item) {
                this.editedIndex = this.rows.indexOf(item);
                this.editedItem = item;
                // console.log(this.editedItem);
                this.dialog = true
            },

            async deleteItem (item) {
                await this.$store.dispatch('deleteRecord', item.id);
                this.getRecords();

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
                    // await this.$store.dispatch('createNewMC',this.editedItem);
                }else {
                    await this.$store.dispatch('updateRecord', this.editedItem);
                    // await this.$store.dispatch('updateMaterialCode', this.editedItem);
                }
                this.getRecords();
                this.close()
            },
        }
    }
</script>