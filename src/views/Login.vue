<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title class="headline">Login</v-card-title>
                <v-card-text>Continue anonymously or login with google?</v-card-text>
                <v-card-actions>
                    <v-btn color="primary" dark @click="anonymousLogin()">Anonymous</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="googleLogin()">Google Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<style>
    body{
        background-color: #ff0009;
    }
</style>
<script>
    //import HeaderComponent from './components/header.vue'
    //import OtherComponent from './components/other.vue'
    import { mapActions, mapState } from 'vuex';

    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        computed: mapState('auth', ['user', 'isLoggedIn']),
        methods: mapActions('auth', ['googleLogin','anonymousLogin']),
        watch: {
            isLoggedIn (value) {
                if (value) {
                    this.$router.push('/today')
                }
            }
        },
        components:{
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
