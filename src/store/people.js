import firebase from '@/service/firebase.js';
import Vue from 'vue';
import {Util} from '../util.js';

const PEOPLE = "people";

const state = {
    people: {},
    wizardComplete: false
};

const mutations = {
    setPerson(state, payload) {
        if (payload && payload.id && payload.person) {
            Vue.set(state.people, payload.id, payload.person);
        }
    },
    setPeople(state, people) {
        if (people) {
            Vue.set(state, 'people', people);
        }
    },
    deletePerson(state, id) {
        if (id && state.people.hasOwnProperty(id)) {
            Vue.delete(state.people, id);
        }
    },
    setWizardComplete(state, complete) {
        Vue.set(state, 'wizardComplete', complete);
    }
};

const actions = {
    async getPeople({commit, rootState}) {
        // Call firebase to get people only if we haven't gotten the people from firebase already
        if (rootState.auth.isLoggedIn && Object.keys(state.people).length === 0) {
            try {
                let result = await firebase.firestore().collection('users').doc(rootState.auth.user.id).get();
                if (result.exists) {
                    commit('setPeople', result.data().people);
                    commit('setWizardComplete', result.data().wizardComplete);
                } else {
                    console.log("No saved people");
                }
            } catch (err) {
                console.error("Failed to retrieve people " + err);
            }
        }
    },
    async addPerson({commit, rootState}, person) {
        // Call firebase to add the person
        // update the state
        if (rootState.auth.isLoggedIn && person) {
            try {
                let uid = Util.createUID();
                person.daysChoresCompleted = 0;
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`people.${uid}`]: person});
                commit('setPerson', {id: uid, person: person});
            } catch(err) {
                console.error("Failed to save person " + err);
            }
        } else {
            console.error('You must be logged in to add a person');
        }
    },
    async deletePerson({commit, dispatch, rootState}, id) {
        // update firebase
        if (rootState.auth.isLoggedIn && id && state.people.hasOwnProperty(id)) {
            try {
                // Delete chores for that user
                dispatch('chores/deleteUserChores', id, {root:true});
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`people.${id}`]: firebase.firestore.FieldValue.delete()});
                //update the state
                commit('deletePerson', id);
            } catch(err) {
                console.error("Failed to delete person from firebase " + err);
            }
        } else {
            console.error('You must be logged in to delete a person');
        }
    },
    /**
     * The payload must contain the id of the person being edited
     * ex: payload = {id: 1234, person: personObj}
     * @param commit
     * @param rootState
     * @param payload
     * @returns {Promise<void>}
     */
    async editPerson({commit, rootState}, payload) {
       if (rootState.auth.isLoggedIn && payload && payload.id && payload.person) {
           try {
               let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
               await userRef.update({[`people.${payload.id}`]: payload.person});
               commit('setPerson', payload);
           } catch(err) {
               console.error('Failed to edit person in firebase' + err);
           }
       } else {
           console.error('You must be logged in to edit a person');
       }
    },
    async completedChores({commit, rootState}, id) {
        if (rootState.auth.isLoggedIn && id && state.people.hasOwnProperty(id)) {
            try {
                let person = Object.assign({}, state.people[id]);
                if (!person.hasOwnProperty('daysChoresCompleted')) {
                    person.daysChoresCompleted = 0;
                }
                person.daysChoresCompleted++;
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`people.${id}.daysChoresCompleted`]: person.daysChoresCompleted});
                commit('setPerson', {id: id, person: person});
            } catch(err) {
                console.error('Failed to update completed chores for person in firebase' + err);
            }
        } else {
            console.error('You must be logged in to complete chores for a person');
        }
    },
    async unCompleteChores({commit, rootState}, id) {
        if (rootState.auth.isLoggedIn && id && state.people.hasOwnProperty(id)) {
            try {
                let person = Object.assign({}, state.people[id]);

                if (!person.hasOwnProperty('daysChoresCompleted')) {
                    person.daysChoresCompleted = 0;
                }
                if (person.daysChoresCompleted > 0) {
                    person.daysChoresCompleted--;
                }
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({[`people.${id}.daysChoresCompleted`]: person.daysChoresCompleted});
                commit('setPerson', {id: id, person: person});
            } catch(err) {
                console.error('Failed to update completed chores for person in firebase' + err);
            }
        } else {
            console.error('You must be logged in to complete chores for a person');
        }
    },
    async completeWizard({commit, rootState}) {
        if (rootState.auth.isLoggedIn) {
            try {
                let userRef = firebase.firestore().collection('users').doc(rootState.auth.user.id);
                await userRef.update({['wizardComplete']: true});
                commit('setWizardComplete', true);
            } catch(err) {
                console.error('Failed to set wizard complete in firebase' + err);
            }
        } else {
            console.error('You must be logged in to complete the wizard');
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};