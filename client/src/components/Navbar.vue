<template>
    <v-card
            flat
            height="48px"
            tile
            dark
    >
        <v-app-bar fixed color="#455A64" app dense>
            <v-app-bar-nav-icon @click.stop="onSandwichMenuClick"></v-app-bar-nav-icon>
            <v-toolbar-title class="v-card--link" @click="toHome">Opportunity Management</v-toolbar-title>
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
            <v-card color="#455A64" tile flat height="150px">
                <v-list-item two-line>
                    <!--                    <v-list-item-avatar>-->
                    <!--                        <img src="">-->
                    <!--                    </v-list-item-avatar>-->

                    <v-list-item-content>
                        <v-icon @click="drawer = false" class="justify-end mb-10">close</v-icon>
                        <v-list-item-title>PLM</v-list-item-title>
                        <v-list-item-subtitle>Opportunity Management</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-divider></v-divider>
            <v-card flat color='white' tile height="600px">
                <v-list
                        dense
                        nav
                        light
                        class='pt-5'
                >
                    <v-list-item v-for='item in items'
                                 :key='item.title' link v-model='group'
                                 :to='item.action'
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
            <template v-slot:append>
                <div class='pa-1 grey lighten-2'>
                    <v-btn @click='logout' block light small>
                        Logout
                    </v-btn>
                    <!--            <v-subheader-->
                    <!--              @click="logout"-->
                    <!--              style="cursor: pointer"-->
                    <!--            >-->
                    <!--              Logout-->
                    <!--            </v-subheader>-->
                </div>
            </template>

        </v-navigation-drawer>
    </v-card>
</template>

<script>
    export default {
        name: "Navbar",
        data () {
            return {
                items: [
                    {
                        title: 'Dashboard',
                        icon: 'dashboard',
                        action: '/dashboard'
                    },
                    {
                        title: 'Projects Overview',
                        icon: 'view_module',
                        action: '/overview'
                    },
                    {
                        title: 'Project Update',
                        icon: 'update',
                        action: '/project-update'
                    },
                    {
                        title: 'Edit Opportunity',
                        icon: 'edit',
                        action: '/opportunity'
                    },
                    {
                        title: 'Project Detail',
                        icon: 'details',
                        action: '/project-detail'
                    },
                    {
                        title: 'Project Resources',
                        icon: 'category',
                        action: '/project-resources'
                    },
                    {
                        title: 'Accounts',
                        icon: 'supervisor_account',
                        action: '/account'
                    },
                    {
                        title: 'Admin Console',
                        icon: 'settings',
                    }

                ],
                right: false,
                drawer: null,
                group: null,
                color: '#fff',
                miniVariant: false,
                expandOnHover: false,
                background: false,
                current_page: null
        };
        },
        methods: {
            onSandwichMenuClick(){
                this.drawer = !this.drawer
            },
            toHome(){
                this.$router.push({path: '/'})
            },
            async logout() {
                await this.$store.dispatch('logout');
                await this.$router.push('/login');
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