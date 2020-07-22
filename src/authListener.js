import firebase from '@/service/firebase.js';
import store from '@/store/index.js';
import {Util} from './util.js';

firebase.auth().onAuthStateChanged((profile) => {
    if (profile) {
        const user = {
            id: profile.uid,
            name: profile.displayName,
            image: profile.photoURL,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        };
        store.commit('auth/setUser', user);
        initializeDB(user);
    } else {
        store.commit('auth/setUser', null);
    }
});

async function initializeDB(user) {
    console.log("Initializing " + user.id);
    let doc = firebase.firestore().collection('users').doc(user.id);
    let userDoc = await doc.get();
    if (userDoc.exists && userDoc.data().hasOwnProperty('chores')) {
        console.log("Collection already initialized");
    } else {
        let people = {};
        people[Util.createUID()] = {
            name:user.name,
            uid: user.id,
            created: new Date().getTime(),
            daysChoresCompleted: 0,
            avatar: user.image
        };
        await doc.set({
            chores:[],
            people: people
        });
    }
}
