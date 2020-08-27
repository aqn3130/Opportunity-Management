<template>
    <div>
        <v-card
                style="z-index: 1;margin-top: -50px"
                color="#607D8B"
                height="200"
                width="auto"
                tile
                dark
        >
            <v-card-text class="text-center overline">
            </v-card-text>
        </v-card>
        <v-layout>
            <v-flex style="z-index: 2">
                <v-container class="mb-10 pa-5" fluid>
                    <v-card class="grey lighten-5" flat>

                    </v-card>
                </v-container>
            </v-flex>
        </v-layout>
    </div>
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
            }
        }
    }
</script>
