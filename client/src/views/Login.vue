<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" offset-md="3">
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card max-width="500px">
                        <v-card-title>Login</v-card-title>
                        <v-card-text>
                            <v-text-field
                                    :value="username"
                                    :rules="nameRules"
                                    label="Username"
                                    hint="Springernature domain username, like: abc2030"
                                    required
                                    class="mb-5"
                                    placeholder="username"
                                    @input="setUsername"
                            ></v-text-field>

                            <v-text-field
                                    :value="password"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required]"
                                    :type="show1 ? 'text' : 'password'"
                                    name="input-10-1"
                                    label="Password"
                                    hint="Springernature domain password"
                                    placeholder="password"
                                    counter
                                    @click:append="show1 = !show1"
                                    @input="setPassword"
                            ></v-text-field>
                            <v-alert type="error" v-if="loginError">
                                <small>{{loginError}}</small>
                            </v-alert>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Login</v-btn>
                            <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import { mapState, mapActions, mapGetters, mapMutations} from 'vuex';
    export default {
        name: 'Login',
        data: () => ({
            valid: true,
            nameRules: [
                v => !!v || "Username/Email is required"
                // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            rules: {
                required: value => !!value || "Password Required."
                // min: v => v.length >= 8 || 'Min 8 characters',
                // emailMatch: () => ('The email and password you entered don\'t match'),
            },
            show1: false,
            show2: false,
        }),
        computed: {
            ...mapState('auth', [
                'username',
                'password',
                'loginError'
            ])
        },
        methods: {
            ...mapMutations('auth', [
                'setUsername',
                'setPassword',
                'setError'
            ]),
            ...mapActions('auth', [
                'login'
            ]),
            validate() {
                if (this.$refs.form.validate()) {
                    this.login();
                }
            },
            reset() {
                this.$refs.form.reset();
                this.setError(null);
            },
        },
    }
</script>