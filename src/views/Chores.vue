<template>
    <v-layout row>
        <v-flex xs12 xs6>
            <v-card>
                <v-card-title>Chores</v-card-title>
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
                                <v-icon color="grey lighten-1" @click="loadEditDialog(id)">edit</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                            <v-btn icon ripple>
                                <v-icon color="grey lighten-1" @click="deleteChore(id)">delete</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <!-- Adding this last row for spacing so the add button doesn't cover the last row -->
                    <v-list-tile></v-list-tile>
                </v-list>
                    </v-card-text>
                <v-card-actions>
                    <v-btn
                            class="main-add-btn"
                            dark
                            fab
                            fixed
                            right
                            color="pink"
                            @click="loadAddDialog()"
                    >
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-dialog v-model="dialog" persistent max-width="600px" :fullscreen="windowWidth < 600">
            <v-card class="px-4 py-2">
                <v-card-title><h2>Add Chore</h2></v-card-title>
                <v-card-text>
                    <v-form>
                        <v-switch label="Enabled" v-model="newChore.enabled"></v-switch>
                        <v-autocomplete label="Owner:" validate-on-blur :items="people" v-model="newChore.owner"></v-autocomplete>
                        <v-text-field label="Title" v-model="newChore.title"></v-text-field>
                        <v-textarea label="Description:" v-model="newChore.description"></v-textarea>
                       <!-- <v-select
                                :items="schedules"
                                v-model="newChore.schedule"
                                menu-props="auto"
                                hide-details
                                label="Schedule:"
                                single-line
                        ></v-select>-->
                        <!--<v-switch label="Rollover to next day if chore isn't completed?" v-model="newChore.rollOver"></v-switch>-->
                        <!-- start date -->
                        <day-picker v-model="newChore.schedule"></day-picker>
                        <p v-if="showDayError">Please Select A Day</p>
                        <!--
                        <v-menu
                                v-if="showStartDate(newChore.schedule)"
                                ref="startmenu"
                                :close-on-content-click="false"
                                v-model="startDateMenu"
                                :nudge-right="40"
                                :return-value.sync="newChore.startdate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    v-model="newChore.startdate"
                                    label="Start Date:"
                                    prepend-icon="event"
                                    readonly
                            ></v-text-field>
                            <v-date-picker v-model="newChore.startdate" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.startmenu.save(newChore.startdate)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                        -->
                        <!-- end date
                        <v-menu
                                ref="endmenu"
                                :close-on-content-click="false"
                                v-model="endDateMenu"
                                :nudge-right="40"
                                :return-value.sync="newChore.enddate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    v-model="newChore.enddate"
                                    label="End Date:"
                                    prepend-icon="event"
                                    readonly
                            ></v-text-field>
                            <v-date-picker v-model="newChore.enddate" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.endmenu.save(newChore.enddate)">OK</v-btn>
                            </v-date-picker>
                        </v-menu> -->
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false; newChore={}">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="add()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog" persistent max-width="600px" :fullscreen="windowWidth < 600">
            <v-card class="px-4 py-2">
                <v-card-title><h2>Edit Chore</h2></v-card-title>
                <v-card-text>
                    <v-form>
                        <v-switch label="Enabled" v-model="selectedChore.enabled"></v-switch>
                        <v-autocomplete label="Owner:" validate-on-blur :items="people" v-model="selectedChore.owner"></v-autocomplete>
                        <v-text-field label="Title" v-model="selectedChore.title"></v-text-field>
                        <v-textarea label="Description:" v-model="selectedChore.description"></v-textarea>
                        <day-picker v-model="selectedChore.schedule"></day-picker>
                        <!--<v-switch label="Rollover to next day if chore isn't completed?" v-model="selectedChore.rollOver"></v-switch>-->
                        <!-- start date
                        <v-menu
                                v-if="showStartDate(selectedChore.schedule)"
                                ref="editstartmenu"
                                :close-on-content-click="false"
                                v-model="editStartDateMenu"
                                :nudge-right="40"
                                :return-value.sync="selectedChore.startdate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    v-model="selectedChore.startdate"
                                    label="Start Date:"
                                    prepend-icon="event"
                                    readonly
                            ></v-text-field>
                            <v-date-picker v-model="selectedChore.startdate" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="editStartDateMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.editstartmenu.save(selectedChore.startdate)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                        -->
                        <!-- end date
                        <v-menu
                                ref="editendmenu"
                                :close-on-content-click="false"
                                v-model="editEndDateMenu"
                                :nudge-right="40"
                                :return-value.sync="selectedChore.enddate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    v-model="selectedChore.enddate"
                                    label="End Date:"
                                    prepend-icon="event"
                                    readonly
                            ></v-text-field>
                            <v-date-picker v-model="selectedChore.enddate" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="editEndDateMenu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.editendmenu.save(selectedChore.enddate)">OK</v-btn>
                            </v-date-picker>
                        </v-menu> -->
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="editDialog = false; selectedChore={}">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="saveEditedChore()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<style>
    body{
        background-color:#ff0000;
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
    import DayPicker from '../components/DayPicker.vue';

    export default{
        data(){
            return{
                dialog: false,
                editDialog: false,
                showDayError: false,
                windowWidth: window.innerWidth,
                startDateMenu: false,
                endDateMenu: false,
                editStartDateMenu: false,
                editEndDateMenu: false,
                editIndex: 0,
                newChore:{title: ""},
                selectedChore: {},
                personFilter: "All",
              //schedules: ["once", "daily", "weekly","bi-weekly","monthly"]
            }
        },
        components:{
            //'other-component':OtherComponent,
            //HeaderComponent,
            DayPicker
        },
        methods: {
            ...mapActions('chores', ['getChores','addChore', 'deleteChore', 'editChore']),
            add: function () {
                if(this.newChore.schedule.days.length > 0) {
                    this.newChore.startdate = Util.getDateString(new Date());
                    this.addChore(this.newChore);
                    this.dialog = false;
                    this.newChore={};
                    this.showDayError = false;
                }
              else{
                  this.showDayError = true;
                }
            },
            loadAddDialog: function() {
                this.newChore.enabled = true;
                this.dialog = true;
            },
            loadEditDialog: function (id) {
                this.editDialog = true;
                this.editId = id;
                this.selectedChore = Object.assign({}, this.filteredChores[id]);
            },
            saveEditedChore: function () {
                this.editDialog = false;
                this.editChore({id: this.editId, chore: this.selectedChore});
            },
            getAvatar: function(ownerId) {
                let avatar = null;
                if (ownerId && this.$store.state.people.people[ownerId]) {
                    avatar = this.$store.state.people.people[ownerId].avatar;
                }
                return avatar;
            },
            showDayPicker: function(schedule) {
                return (schedule === 'weekly' || schedule === 'bi-weekly');
            },
            showStartDate: function(schedule) {
                return (schedule === 'monthly');
            }
        },
        created: function() {
            this.getChores();
            this.$store.dispatch('people/getPeople');
        },
        mounted: function() {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth;
            });
        },
        computed: {
            filteredChores: function () {
                let owner = this.personFilter;
                if (owner === "All") {
                    return Object.assign({},this.$store.state.chores.chores);
                } else {
                    return Util.filter(this.$store.state.chores.chores, c => c.owner === owner);
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
