import firebase from '@/service/firebase.js';
import router from '../router/index.js';

const state = {
    user: {},
    isLoggedIn: false,
    loggedInAnonymously: false
};

const getters = {
    isLoggedIn: state => {
        return state.isLoggedIn;
    }
};

const mutations = {
    setUser(state, user) {
        if (user) {
            state.user = user;
            state.isLoggedIn = true;
            if (!user.name) {
                state.loggedInAnonymously = true;
            }
        } else {
            state.user = {};
            state.isLoggedIn = false;
            state.loggedInAnonymously = false;
        }
    }
};

const actions = {
  async googleLogin({commit}) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      //dispatch('people/addPerson', result.user.displayName, {root:true});
      //firebase.firestore().collection('users').doc(result.user.uid).set({people: [result.user.displayName]});
  },
  async anonymousLogin({commit}) {
      const result = await firebase.auth().signInAnonymously();

      await firebase.firestore().collection('users').doc(result.user.uid);
      console.log(result.user);
  },
  async promoteLoginWithGoogle({commit}) {
      const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
      const userCred = await firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential);
      // commit('setUser', {
      //     id: userCred.uid,
      //     name: userCred.displayName,
      //     image: userCred.photoURL
      // });
  },
  autoSignIn( {commit}, user) {
      // commit ('setUser', {id: user.uid, name: user.displayName, image: user.photoURL})
  },
  async logout({commit}) {
      await firebase.auth().signOut();
      commit('setUser', null);
      router.push('/');
  }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};