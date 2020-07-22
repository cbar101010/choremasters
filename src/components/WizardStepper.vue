<template>
    <div>
        <v-stepper v-model="step">
            <v-stepper-header>
                <v-stepper-step step="1">Add People</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">Add Chores</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Complete Chores</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">View Rewards</v-stepper-step>
            </v-stepper-header>
        </v-stepper>
        <div class="tutorial-block">
            <v-sheet class="pa-5">
                <h1 class="display-2">Tutorial</h1>
            </v-sheet>
            <v-layout align-center justify-space-around row fill-height>
                <v-sheet class="pa-5 tutorial-block-heading">
                    <h1 class="teal--text">{{heading}}</h1>
                </v-sheet>
                <v-sheet class="pa-5">
                    <blockquote class="blue-grey--text blockquote">{{message}}</blockquote>
                </v-sheet>
            </v-layout>
            <div class="tutorial-buttons">
                <v-btn color="primary" @click="nextStep()">
                    {{continueButton}}
                </v-btn>
                <v-btn flat @click="completeWizard()">Skip Tutorial</v-btn>
            </div>
        </div>
        <v-card>
            <slot></slot>
        </v-card>
    </div>
</template>
<style>
    .tutorial-buttons {
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .tutorial-block {
        background-color: #E0F7FA;
    }
    .tutorial-block-heading {
        min-width: 300px;
    }
</style>
<script>
    import { mapActions, mapState } from 'vuex';
    export default{
        data(){
            return{
                continueButton: "Continue"
            }
        },
        props: {
            step: {
                type: Number,
                default: 1
            },
            message: String,
            heading: String
        },
        methods: {
            ...mapActions('people', ['completeWizard']),
            nextStep: function() {
              switch(this.step) {
                case 1:
                    this.$router.push('/chores');
                    break;
                case 2:
                    this.$router.push('/today');
                    break;
                case 3:
                    this.$router.push('/rewards');
                    break;
                case 4:
                    this.completeWizard();
              }
           }
        },
        watch: {
            step: function() {
                if (this.step === 4) {
                    this.continueButton = "Finish";
                }
            }
        },
        created: function() {
            if (this.step === 4) {
                this.continueButton = "Finish";
            }
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