<template>
    <div class="daypicker">
        <v-layout>
                <v-checkbox label="Every Day" v-model="daily" @change="changeDaily()">
                </v-checkbox>
                <v-checkbox label="Repeat" v-model="value.repeat" @change="changeRepeat()"></v-checkbox>
        </v-layout>

        <v-btn fab dark small v-bind:color="getColor('sunday')" @click="toggle('sunday')">S</v-btn>
        <v-btn fab dark small v-bind:color="getColor('monday')" @click="toggle('monday')">M</v-btn>
        <v-btn fab dark small v-bind:color="getColor('tuesday')" @click="toggle('tuesday')">T</v-btn>
        <v-btn fab dark small v-bind:color="getColor('wednesday')" @click="toggle('wednesday')">W</v-btn>
        <v-btn fab dark small v-bind:color="getColor('thursday')" @click="toggle('thursday')">T</v-btn>
        <v-btn fab dark small v-bind:color="getColor('friday')" @click="toggle('friday')">F</v-btn>
        <v-btn fab dark small v-bind:color="getColor('saturday')" @click="toggle('saturday')">S</v-btn>
    </div>
</template>
<style>
    h1, h3 {
        text-align: center;
    }
    .daypicker .v-btn--floating.v-btn--small {
        height: 25px;
        width: 25px;
    }

    .v-btn {
        min-width: 0px;
    }
</style>
<script>
    import { mapActions, mapState } from 'vuex';
    import Vue from 'vue';
    export default{
        data(){
            return {
                daily: false
            }
        },
        props: {
            value: {
                type: Object,
                default: () => {return {days:[], repeat:false}}
            }
        },
        methods: {
           getColor: function(day) {
                let color = this.value.days.indexOf(day) > -1 ? 'blue' : 'grey';
                return color;
           },
           toggle: function(day) {
                let dayIndex = this.value.days.indexOf(day);
                if (dayIndex === -1) {
                    this.value.days.push(day);
                } else {
                    this.value.days.splice(dayIndex, 1);
                    this.daily = false;
                }
               // You must emit @input if you want v-model to work with your component
               this.$emit('input', this.value);
           },
            changeDaily: function() {
               if(this.daily){
                   this.value.days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
               }
               else{
                   this.value.days = [];
                }
                this.$emit('input', this.value);
            },
            changeRepeat: function() {
                this.$emit('input', this.value);
            }
        },
        created: function() {

        },
        computed: {

        }
    }
</script>