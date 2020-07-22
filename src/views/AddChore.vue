<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card class="px-4 py-2">
                <v-card-title>Add Chore</v-card-title>
            <v-form>
                <v-autocomplete label="Owner:" validate-on-blur :items="people" v-model="chore.owner"></v-autocomplete>
                <v-text-field label="Title" v-model="chore.title"></v-text-field>
                <v-select
                        :items="schedules"
                        v-model="chore.schedule"
                        menu-props="auto"
                        hide-details
                        label="Schedule:"
                        single-line
                ></v-select>
                <v-textarea label="Description:" v-model="chore.description"></v-textarea>
                <v-switch label="Rollover to next day if chore isn't completed?" v-model="chore.rollOver"></v-switch>
                <!-- start date -->
                <v-menu
                        ref="startmenu"
                        :close-on-content-click="false"
                        v-model="menu"
                        :nudge-right="40"
                        :return-value.sync="date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            v-model="chore.startdate"
                            label="Start Date:"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker v-model="chore.startdate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="startdatemenu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.startmenu.save(startdate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-form>
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
    export default{
        data() {
            return {
                startDateMenu: false,
                chore:{},
                schedules: ["once", "daily", "weekly"]
            }
        },
        components:{
        },
        computed: {
            people: function () {
                return this.$store.state.people.people;
            }
        }
    }
</script>
