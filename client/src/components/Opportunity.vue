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
                            v-model="salesRep"
                            :rules="nameRules"
                            label="Sales Rep"
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
                            :items="items"
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
                            :items="items"
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
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: false,
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
        },
    }
</script>
