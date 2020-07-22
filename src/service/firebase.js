import firebase from 'firebase';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyCp-4O8jTHogVQfs6efYpCHzClWW-B5AGs",
    authDomain: "choremaster-6686c.firebaseapp.com",
    databaseURL: "https://choremaster-6686c.firebaseio.com",
    projectId: "choremaster-6686c",
    storageBucket: "choremaster-6686c.appspot.com",
    messagingSenderId: "1031728707154"
};
firebase.initializeApp(config);

export default firebase;