<template>
     <v-layout row>
        <v-flex xs12>
            <v-card>
                <v-card-title>Today's Chores</v-card-title>
                <v-select class="filter-dropdown" :items="peopleFilters" label="Filter" v-model="personFilter"></v-select>
                <v-card-text>
                    <v-list two-line subheader>
                        <v-list-tile
                                v-for="(chore,id) in filteredChores"
                                :key="id"
                                avatar
                                @click=""
                        >
                            <v-list-tile-avatar v-if="getAvatar(chore.owner)">
                                <img :src="getAvatar(chore.owner)" :title="chore.owner">
                            </v-list-tile-avatar>

                            <v-list-tile-avatar v-if="!getAvatar(chore.owner)">
                                <img  :title="chore.owner" src="https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Fnoavatar.jpeg?alt=media&token=a8db8762-d3b7-4b66-8716-cc26da2db01b">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ chore.title }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ chore.description }}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon v-bind:class="[isChoreDone(chore.done) ? 'blue' : 'grey']" color="grey lighten-1" @click="completeChore(chore, id)">done</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-subheader>Completed</v-subheader>
                    <v-list two-line subheader>
                        <v-list-tile
                                v-for="(completeChore,id) in filteredCompleteChores"
                                :key="id"
                                avatar
                                @click=""
                        >
                            <v-list-tile-avatar v-if="getAvatar(completeChore.owner)">
                                <img :src="getAvatar(completeChore.owner)" :title="completeChore.owner">
                            </v-list-tile-avatar>

                            <v-list-tile-avatar v-if="!getAvatar(completeChore.owner)">
                                <img  :title="completeChore.owner" src="https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Fnoavatar.jpeg?alt=media&token=a8db8762-d3b7-4b66-8716-cc26da2db01b">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ completeChore.title }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ completeChore.description }}</v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon v-bind:class="[isChoreDone(completeChore.done) ? 'blue' : 'grey']" color="grey lighten-1" @click="unCompleteChore(completeChore, id)">done</v-icon>
                                </v-btn>
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

    .blue {
        color: blue;
    }

    .v-select {
        margin: auto;
        width: 96%;
    }

</style>
<script>
    //import HeaderComponent from './components/header.vue'
    //import OtherComponent from './components/other.vue'
    import { mapActions, mapState } from 'vuex';
    import {Util} from '../util.js';
    export default{
        data(){
            return{
                personFilter: "All"
            }
        },
        components:{
            //'other-component':OtherComponent,
            //HeaderComponent,
        },
        methods: {
            ...mapActions('chores', ['getChores','finishChore', 'unfinishChore']),
            getAvatar: function(owner) {
                let avatar = null;
                if (owner && this.$store.state.people.people[owner]) {
                    avatar = this.$store.state.people.people[owner].avatar;
                }
                return avatar;
            },
            getValidChores: function(chores) {
                return Util.filter(chores, c => {
                    let today = new Date();
                    let startDate = new Date(`${c.startdate}T00:01:01`);
                    let valid = false;
                    // If repeating then always check to see if today is in days
                    if (c.schedule && c.schedule.repeat){
                        if (c.schedule.days.indexOf(Util.getDayString(today.getDay())) > -1) {
                            valid = true;
                        }
                       // Check to make sure that we are in the same week as the startdate
                    } else if (today.getDay() >= startDate.getDay() && today.getDay() - startDate.getDay() < 7) {
                        if (c.schedule.days.indexOf(Util.getDayString(today.getDay())) > -1) {
                                valid = true;
                        }
                    }
                    return valid;
                });
            },
            completeChore(chore, id) {
                // Check if all chores are completed
                let choresLeft = this.getChoresLeftForUser(chore);
                if (!choresLeft || Object.keys(choresLeft).length === 0) {
                    this.$store.dispatch('people/completedChores', chore.owner);
                }
                this.finishChore(id);
            },
            unCompleteChore(chore, id) {
                // Check if all chores are completed
                let choresLeft = this.getChoresLeftForUser(chore);
                if (!choresLeft || Object.keys(choresLeft).length === 0) {
                    this.$store.dispatch('people/unCompleteChores', chore.owner);
                }
                this.unfinishChore(id);
            },
            getChoresLeftForUser(chore) {
                // get chores left excluding the chore passed in
                return Util.filter(this.filteredChores, c => {
                    return c.owner === chore.owner && c.id !== chore.id;
                });
            },
            isChoreDone(doneTimestamp) {
                let result = false;
                if (doneTimestamp) {
                    // true if completed today
                    result = Util.sameDay(new Date(), new Date(doneTimestamp));
                }
                return result;
            }
        },
        created: function() {
            this.getChores();
            this.$store.dispatch('people/getPeople');
        },
        computed: {
            filteredCompleteChores: function () {
                let owner = this.personFilter;
                let today = new Date();
                let chores = this.getValidChores(this.$store.state.chores.chores);
                console.log("valid Chores" + chores);
                if (owner === "All") {
                    return Util.filter(chores, c => c.done && Util.sameDay(today, new Date(c.done)));
                } else {
                    return Util.filter(chores, c => c.owner === owner && c.done && Util.sameDay(today, new Date(c.done)));
                }
            },
            filteredChores: function () {
                let owner = this.personFilter;
                let today = new Date();
                let chores = this.getValidChores(this.$store.state.chores.chores);
                if (owner === "All") {
                    return Util.filter(chores, c => !c.done || !Util.sameDay(today, new Date(c.done)));
                } else {
                    return Util.filter(chores, c => c.owner === owner && (!c.done || !Util.sameDay(today, new Date(c.done))));
                }
            },
            people: function () {
                let people = this.$store.state.people.people;
                return Object.keys(people).map(key => {
                    return {text: people[key].name, value: key};
                });
            },
            peopleFilters: function() {
                let peopleFilters = this.people.slice();
                peopleFilters.unshift({text: "All", value: "All"});
                return peopleFilters;
            }
        }
    }
</script>
