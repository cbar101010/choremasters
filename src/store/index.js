import Vue from 'vue';
import Vuex from 'vuex';
import {firebaseMutations, firebaseAction} from 'vuexfire';
import auth from './auth.js';
import chores from './chores.js';
import people from './people.js';
import sw from './sw.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        chores,
        people,
        sw
    }
});
