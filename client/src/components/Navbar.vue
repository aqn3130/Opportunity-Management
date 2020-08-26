<template>
    <v-card
            flat
            height="48px"
            tile
            dark
    >
        <v-app-bar fixed color="primary" app dense>
            <v-app-bar-nav-icon @click.stop="onSandwichMenuClick"></v-app-bar-nav-icon>
            <v-toolbar-title class="v-card--link" @click="toHome">iMDM</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer
                v-model="drawer"
                :color="color"
                :expand-on-hover="expandOnHover"
                :mini-variant="miniVariant"
                :right="right"
                temporary
                height="800px"
                width="300px"
                app
        >
            <v-card color="primary" tile flat height="150px">
                <v-list-item two-line>
                    <!--                    <v-list-item-avatar>-->
                    <!--                        <img src="">-->
                    <!--                    </v-list-item-avatar>-->

                    <v-list-item-content>
                        <v-icon @click="drawer = false" class="justify-end mb-10">close</v-icon>
                        <v-list-item-title>iMDM</v-list-item-title>
                        <v-list-item-subtitle>Intelligent Master Data Management</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>

            <v-list
                    nav
                    class="py-0"
                    dense
            >

<!--                <v-divider class="mb-5 mt-5 white"></v-divider>-->

                <v-card
                        class="mt-10 grey lighten-3"
                        width="300px"
                        light
                >
                    <v-list-group
                            sub-group
                            no-action
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>CRM/PLM</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                                v-for="item in items1"
                                :key="item.title"
                                @click=""
                                v-model="group"
                                :to=item.action
                        >
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                            <v-list-item-action>
                                <v-icon v-text="item[2]"></v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-group>
                </v-card>

                <v-card
                        class="mt-5 grey lighten-3"
                        width="300px"
                        light
                >
                <v-list-group
                        sub-group
                        no-action
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>iMDM</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                            v-for="item in items"
                            :key="item.title"
                            @click=""
                            v-model="group"
                            :to=item.action
                    >
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                        <v-list-item-action>
                            <v-icon v-text="item[2]"></v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-group>
                </v-card>
            </v-list>
<!--            <v-list dark>-->
<!--                <v-list-item title="Users" to="/users"></v-list-item>-->
<!--            </v-list>-->
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        <v-list-item-action class="ml-0"><v-btn to="/users" text><v-icon class="mr-5">mdi-account</v-icon>Accounts</v-btn></v-list-item-action>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
    export default {
        name: "Navbar",
        data () {
            return {
                items: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard', action: '/dashboard' },
                    { title: 'Revenue Account', icon: 'mdi-image', action: '/revenue_account' },
                    { title: 'Material Code', icon: 'mdi-image', action: '/material_code' },
                    { title: 'Product Title', icon: 'mdi-image', action: '/product_title' },
                    { title: 'Region Assigned VP', icon: 'mdi-image', action: '/region_assigned_vp' },
                    { title: 'Product Group Hierachy', icon: 'mdi-image', action: '/product_group_hierachy' },
                    { title: 'Country Region Territory', icon: 'mdi-image', action: '/country-region-territory' },
                    { title: 'SN Customer Name', icon: 'mdi-image', action: '/sn-customer-name' },
                    { title: 'About', icon: 'mdi-help-box', action: '' },
                ],
                items1: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard', action: '/dashboard' },
                    { title: 'Personnel', icon: 'mdi-image', action: '/personnel' },
                    { title: 'Product', icon: 'mdi-image', action: '/product' },
                    { title: 'Country Map', icon: 'mdi-image', action: '/country-map' },
                    { title: 'LD-Stage', icon: 'mdi-image', action: '/ld-stage' },
                    { title: 'Likelihood Map', icon: 'mdi-image', action: '/likelihood-map' },
                ],
                right: false,
                drawer: null,
                group: null,
                color: '#fff',
                miniVariant: false,
                expandOnHover: false,
                background: false,
                current_page: null
            }
        },
        methods: {
            onSandwichMenuClick(){
                this.drawer = !this.drawer
            },
            toHome(){
                this.$router.push({path: '/'})
            }
        },
        watch: {
            group () {
                this.drawer = false
            },

        },
        computed: {
            bg() {
                return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
            },
        },
        created() {
            this.current_page = this.$router.currentRoute.name;
        }
    }
</script>
<style>

</style>