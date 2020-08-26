<template>
    <v-container fluid  v-on:user-added="onUserAdd">
        <UserList/>
        <UserTable />
    </v-container>
</template>
<script>
    import UserList from "../components/UserList";
    import UserTable from "../components/UserTable";
    import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';
    export default {
        name: 'Users',
        components: {
            UserList,
            UserTable
        },
        methods: {
            ...mapMutations([
                'getRecords',
            ]),
            onUserAdd(){
                alert('user added');
            }

        },
    }
</script>