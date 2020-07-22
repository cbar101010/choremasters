<template>
     <v-layout row>
        <v-flex xs12 xs6>
            <v-card>
                <v-card-title>Rewards</v-card-title>
                <v-card-text>
                    <v-list two-line subheader>
                        <v-list-tile
                                v-for="(person, id) in people"
                                :key="id"
                                avatar
                                @click=""
                        >
                            <v-list-tile-avatar v-if="person.avatar">
                                 <img :src="person.avatar" :title="person.name">
                            </v-list-tile-avatar>

                            <v-list-tile-avatar v-if="!person.avatar">
                                <img  :title="person.name" src="https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Fnoavatar.jpeg?alt=media&token=a8db8762-d3b7-4b66-8716-cc26da2db01b">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ person.name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action class="hidden-md-and-up" v-if="person.daysChoresCompleted">
                                <v-badge color="orange">
                                    <span slot="badge">{{ Math.floor(person.daysChoresCompleted / 100) }}</span>
                                    <v-icon large color="blue">
                                        mood
                                    </v-icon>
                                </v-badge>
                            </v-list-tile-action>
                            <v-list-tile-action class="hidden-sm-and-down" v-if="person.daysChoresCompleted" v-for="n in Math.floor(person.daysChoresCompleted / 100)" :key="n">
                                <v-icon large color="blue">
                                    mood
                                </v-icon>
                            </v-list-tile-action>
                            <v-list-tile-action class="hidden-md-and-up" v-if="person.daysChoresCompleted">
                                <v-badge color="blue">
                                    <span slot="badge">{{ Math.floor(person.daysChoresCompleted %100 / 10) }}</span>
                                    <v-icon large color="red">
                                        stars
                                    </v-icon>
                                </v-badge>
                            </v-list-tile-action>
                            <v-list-tile-action class="hidden-sm-and-down" v-if="person.daysChoresCompleted" v-for="n in Math.floor(person.daysChoresCompleted % 100 / 10)" :key="n">
                                <v-icon large color="red">
                                    stars
                                </v-icon>
                            </v-list-tile-action>
                            <v-list-tile-action class="hidden-md-and-up">
                                <v-badge color="red">
                                    <span slot="badge">{{ Math.floor(person.daysChoresCompleted % 100 % 10) }}</span>
                                    <v-icon large color="orange">
                                        star
                                    </v-icon>
                                </v-badge>
                            </v-list-tile-action>
                            <v-list-tile-action class="hidden-sm-and-down" v-if="person.daysChoresCompleted" v-for="n in Math.floor(person.daysChoresCompleted % 100 % 10)" :key="n">
                                <v-icon large color="orange">
                                    star
                                </v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    import { mapActions, mapState } from 'vuex';
    export default{
        data(){
            return{

            }
        },
        components:{
        },
        methods: {
            ...mapActions('people', ['getPeople','addPerson', 'deletePerson','editPerson']),
            add: function () {
                this.addPerson(this.newPerson);
                this.dialog = false;
                this.newPerson = {name: ""};
            }
        },
        created: function() {
            this.getPeople();
        },
        computed: {
            people: function () {
                return this.$store.state.people.people;
            }
        }
    }
</script>
