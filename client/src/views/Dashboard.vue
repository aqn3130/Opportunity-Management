<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-row justify="center" align="center">
                    <v-card raised  class="ma-3 pa-6">
<!--                                            <v-img-->
<!--                                                    src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
<!--                                                    aspect-ratio="2.75"-->
<!--                                            ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">
                            Revenue Account
                        </v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>

                        <v-card-actions>
                            <v-btn text color="orange" to="/revenue_account">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <!--                    <v-img-->
                        <!--                            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
                        <!--                            aspect-ratio="2.75"-->
                        <!--                    ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">Material Code</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/material_code">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <!--                    <v-img-->
                        <!--                            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
                        <!--                            aspect-ratio="2.75"-->
                        <!--                    ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">Product Title</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/product_title">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <!--                    <v-img-->
                        <!--                            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
                        <!--                            aspect-ratio="2.75"-->
                        <!--                    ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">Region Assigned VP</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/region_assigned_vp">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <!--                    <v-img-->
                        <!--                            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
                        <!--                            aspect-ratio="2.75"-->
                        <!--                    ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">Product Group Hierachy</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/product_group_hierachy">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <!--                    <v-img-->
                        <!--                            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"-->
                        <!--                            aspect-ratio="2.75"-->
                        <!--                    ></v-img>-->
                        <v-card-title class="justify-center grey lighten-4">Personnel</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/personnel">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">Products</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/product">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">Country Map</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/country-map">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">LD-Stage</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/ld-stage">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">Likelihood Map</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/likelihood-map">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">Country Region Territory</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/country-region-territory">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                    <!--            </v-col>-->
                    <!--            <v-col cols="12" md="4">-->
                    <v-card raised  class="ma-3 pa-6">
                        <v-card-title class="justify-center grey lighten-4">SN Customer Name</v-card-title>
                        <v-card-text>
                            {{ card_text }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="orange" to="/sn-customer-name">Explore</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-row>

            </v-col>
        </v-row>

    </v-container>
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
                card_text: 'Description...'
            }
        }
    }
</script>
