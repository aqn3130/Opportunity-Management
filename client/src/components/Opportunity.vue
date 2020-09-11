<template>
    <v-container>
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <v-row class="px-lg-10">
                <v-col md="6">
                    <v-text-field
                            v-model="currentUser.username"
                            :rules="nameRules"
                            label="Sales Rep"
                            required
                            disabled
                    ></v-text-field>

                    <v-text-field
                            v-model="salesRepType"
                            :rules="nameRules"
                            label="Type"
                            required
                            disabled
                    ></v-text-field>
                    <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                    v-model="date"
                                    label="Opportunity Start Date"
                                    prepend-icon="event"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
                    </v-menu>

                    <v-text-field
                            v-model="opportunityName"
                            :rules="nameRules"
                            label="Opportunity Name"
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="customerName"
                            :rules="nameRules"
                            label="Customer Name"
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="bpId"
                            :rules="nameRules"
                            label="BP ID"
                    ></v-text-field>
                    <v-text-field
                            v-model="memberOfConsortia"
                            :rules="nameRules"
                            label="Member Of Consortia"
                    ></v-text-field>
                    <v-select
                            v-model="country"
                            :items="countryItems"
                            :rules="[v => !!v || 'Item is required']"
                            label="Country"
                            required
                            @input="getStates(country)"
                    ></v-select>
                    <v-select
                            v-model="state"
                            :items="states"
                            label="State"
                            :disabled="state === 'N/A'"
                    ></v-select>
                    <v-select
                            v-model="channelType"
                            :rules="nameRules"
                            label="Channel Type"
                            :items="channelTypeItems"
                            @input="setIndustryType(channelType)"
                    ></v-select>
                    <v-select
                            v-model="industryType"
                            :rules="nameRules"
                            label="Institution/Industry Type"
                            :items="industryTypeItems"
                    ></v-select>
                </v-col>
                <v-col md="6">
                    <v-text-field
                            v-model="name"
                            :counter="10"
                            :rules="nameRules"
                            label="Name"
                            required
                    ></v-text-field>

                    <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                    ></v-text-field>

                    <v-select
                            v-model="select"
                            :items="countryItems"
                            :rules="[v => !!v || 'Item is required']"
                            label="Item"
                            required
                    ></v-select>

                    <v-checkbox
                            v-model="checkbox"
                            :rules="[v => !!v || 'You must agree to continue!']"
                            label="Do you agree?"
                            required
                    ></v-checkbox>

                    <v-btn
                            :disabled="!valid"
                            color="primary"
                            class="mr-4"
                            @click="validate"
                            small
                    >
                        Save & Close
                    </v-btn>

                    <v-btn
                            color="primary"
                            class="mr-4"
                            @click="resetValidation"
                            dark
                            small
                    >
                        Save & Edit
                    </v-btn>

                    <v-btn
                            color="primary"
                            class="mr-4"
                            @click="reset"
                            dark
                            small
                    >
                        Cancel
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "NewOpportunity",
        data: () => ({
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'This field is required',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            countryItems: [],
            checkbox: false,
            salesRepType: null,
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            opportunityName: null,
            customerName: null,
            bpId: null,
            memberOfConsortia: null,
            country: null,
            states: [],
            state: null,
            channelType: null,
            industryType: null,
            channelTypeItems: ['Academic', 'Corporate', 'Government'],
            industryTypeItems: []
        }),
        props: {
            salesRep: String
        },
        methods: {
            validate () {
                this.$refs.form.validate()
            },
            reset () {
                this.$refs.form.reset()
            },
            resetValidation () {
                this.$refs.form.resetValidation()
            },
            async getStates (country) {
                this.states = [];
                this.state = null;
                await this.$store.dispatch('setCurrentTable', 'States');
                const states = await this.$store.dispatch('getRecords', '');
                Object.keys(states).forEach((value, index) => {
                    if (country.toLowerCase().trim() === states[index].Country.toLowerCase().trim()) {
                        this.states.push(states[index].Name);
                    }
                });
                if ( this.states.length === 0 ) {
                    this.states.push('N/A');
                    this.state = this.states[0];
                }
            },
            async setIndustryType (channelType) {
                this.industryTypeItems = [];
                await this.$store.dispatch('setCurrentTable', 'Industry');
                const industries = await this.$store.dispatch('getRecords', '');
                Object.keys(industries).forEach((value, index) => {
                    if (channelType.toLowerCase().trim() === industries[index].Channel.toLowerCase().trim()) {
                        this.industryTypeItems.push(industries[index].Industry);
                    }
                });
            }
        },
        computed: {
            ...mapState('auth', ['currentUser']),
        },
        async created() {
            await this.$store.dispatch('setCurrentTable', 'SalesRep');
            const response = await this.$store.dispatch('getSalesRep', this.currentUser.email);
            this.salesRepType = response[0].Type;
            await this.$store.dispatch('setCurrentTable', 'Country_Region_Territory');
            const countries = await this.$store.dispatch('getRecords', '');
            Object.keys(countries).forEach((value, index) => {
                this.countryItems.push(countries[index].Country);
            });
        }
    }
</script>
