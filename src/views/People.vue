<template>
    <v-layout row>
        <v-flex xs12 xs6>
            <v-card>
                <v-card-title>People</v-card-title>
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
                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon color="grey lighten-1" @click="loadEditDialog(id)">edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon color="grey lighten-1" @click="deletePerson(id)">delete</v-icon>
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
                            right
                            fixed
                            color="pink"
                            @click="dialog = true"
                    >
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card class="px-4 py-2">
                <v-card-title>Add Person</v-card-title>
                <v-select
                        :items="avatars"
                        v-model="newPerson.avatar"
                        menu-props="auto"
                        hide-details
                        label="Avatar:"
                        single-line
                >
                    <template slot="selection" slot-scope="data">
                        <v-avatar size="25px">
                            <img :src="data.item"/>
                        </v-avatar>
                    </template>
                    <template slot="item" slot-scope="data">
                        <v-list-tile-avatar>
                            <img :src="data.item"/>
                        </v-list-tile-avatar>
                    </template>
                </v-select>
                <v-card-text>
                    <v-text-field label="Name" v-model="newPerson.name"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false;">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="add()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card class="px-4 py-2">
                <v-card-title>Edit Person</v-card-title>
                <v-select
                        :items="avatars"
                        v-model="selectedPerson.avatar"
                        menu-props="auto"
                        hide-details
                        label="Avatar:"
                        single-line
                >
                    <template slot="selection" slot-scope="data">
                        <v-avatar size="25px">
                            <img :src="data.item"/>
                        </v-avatar>
                    </template>
                    <template slot="item" slot-scope="data">
                        <v-list-tile-avatar>
                            <img :src="data.item"/>
                        </v-list-tile-avatar>
                    </template>
                </v-select>
                <v-card-text>
                    <v-text-field label="Name" v-model="selectedPerson.name"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="editDialog = false;">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="editDialog = false;editPerson({id: editId, person: selectedPerson})">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                dialog: false,
                newPerson: {name: ""},
                editDialog: false,
                selectedPerson: {},
                editIndex: 0,
                avatars: [
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatarboy1.png?alt=media&token=40667292-5865-43f6-b326-bce3f43af368",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatarboy2.png?alt=media&token=202cc2ea-0781-47d5-a69b-70ad2baa2410",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatarboy3.png?alt=media&token=9e5dcf7b-ecb3-460a-ba00-c4b8b08072c8",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatarboy4.png?alt=media&token=7fa10c4c-fb2f-4057-ac67-069eb9ab73c6",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatarboy5.png?alt=media&token=6330b6e0-6577-4dce-9c3e-ac2cfbe170ff",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatargirl1.png?alt=media&token=712697be-8919-4dc4-8151-d2e8be3a76d3",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatargirl2.png?alt=media&token=d97deaa9-cc60-40d3-9e76-360d1316091d",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatargirl3.png?alt=media&token=97775f79-cca4-4ca0-86eb-f721a9f2ab9e",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatargirl4.png?alt=media&token=c7c9ce8d-a35f-48af-92a8-a89f0e4fe95d",
                    "https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Favatargirl5.png?alt=media&token=71a6742b-1353-4cfa-a22a-8a6edca73d7d"
                ]
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
            },
            loadEditDialog: function (id) {
                this.editDialog = true;
                this.editId = id;
                this.selectedPerson = Object.assign({}, this.people[id]);
            }
        },
        created: function() {
            this.getPeople();
            this.avatars.push(this.$store.state.auth.user.image);
        },
        computed: {
            people: function () {
                return this.$store.state.people.people;
            },
            wizardComplete: function () {
                return this.$store.state.people.wizardComplete;
            }
        }
    }
</script>
