import firebase from '@/service/firebase.js';
import Vue from 'vue';
import {Util} from '../util.js';

const state = {
    chores: {},
    lastVisit: ""
};

const mutations = {
    setLastVisit(state, time) {
        Vue.set(state, 'lastVisit', time);
    },
    setChore(state, payload) {
        if (payload && payload.id && payload.chore) {
            Vue.set(state.chores, payload.id, payload.chore);
        }
    },
    setChores(state, chores) {
        if (chores) {
            Vue.set(state, 'chores', chores);
        }
    },
    deleteChore(state, id) {
        if (id && state.chores.hasOwnProperty(id)) {
            Vue.delete(state.chores, id);
        }
    }
};

const actions = {
    async getChores({commit, rootState}) {
        // Call firebase to get chores if they are logged in and we haven't gotten the chores already
       if (rootState.auth.isLoggedIn) {
           try {
               let result = await firebase.firestore().collection('users').doc(rootState.auth.user.id).get();
               if (result.exists) {
                   commit('setChores', result.data().chores);
               } else {
                   console.log("No saved chores");
               }
           } catch (err) {
               console.error("Failed to retrieve chores " + err);
           }
       }
    },
    async addChore({commit, rootState}, chore) {
        // Call firebase to add the chore
        // update the state
        if (rootState.auth.isLoggedIn && chore) {
            try {
                let uid = Util.createUID();
                let choresRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await choresRef.update({[`chores.${uid}`]: chore});
                commit('setChore', {id: uid, chore: chore});
            } catch(err) {
                console.error("Failed to save chore " + err);
            }
        } else {
            console.error('You must be logged in to add a chore');
        }
    },
    async deleteChore({commit, rootState}, id) {
        // update firebase
        if (rootState.auth.isLoggedIn && id && state.chores.hasOwnProperty(id)) {
            try {
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`chores.${id}`]: firebase.firestore.FieldValue.delete()});
                //update the state
                commit('deleteChore', id);
            } catch(err) {
                console.error("Failed to delete chore from firebase " + err);
            }
        } else {
            console.error('You must be logged in to delete a chore');
        }
    },
    async editChore({commit, rootState}, payload) {
        if (rootState.auth.isLoggedIn) {
            try {
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`chores.${payload.id}`]: payload.chore});
                commit('setChore', {id: payload.id, chore: payload.chore});
            } catch (err) {
                console.log('Failed to edit chore ' + err);
            }
        } else {
            console.error("Your not logged in");
        }
    },
    async finishChore({commit, rootState}, id) {
        if (rootState.auth.isLoggedIn && id && state.chores.hasOwnProperty(id)) {
            try {
                let chore = Object.assign({}, state.chores[id]);
                chore.done = new Date().getTime();
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`chores.${id}.done`]: chore.done});
                commit('setChore', {id: id, chore: chore});
            } catch (err) {
                console.error("Failed to mark chore complete");
            }
        } else {
            console.log("You must be logged in to complete a chore");
        }
    },
    async unfinishChore({commit, rootState}, id) {
        if (rootState.auth.isLoggedIn) {
            try {
                let chore = Object.assign({}, state.chores[id]);
                chore.done = null;
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`chores.${id}.done`]: null});
                commit('setChore',{id: id, chore: chore});
            } catch (err) {
                console.error("Failed to mark chore complete");
            }
        } else {
            console.log("You must be logged in to complete a chore");
        }
    },
    async setVisited({commit}) {
        if (rootState.auth.isLoggedIn) {
            try {
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                const timestamp = new Date().getTime();
                userRef.update({lastVisit: timestamp});
            } catch (err) {
                console.error("Failed to set timestamp");
            }
        } else {
            console.log("You must be logged in to set visited");
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};