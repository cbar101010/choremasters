import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './registerServiceWorker';
import Vuefire from 'vuefire';
import firebase from './service/firebase.js';
import authListener from './authListener.js';

Vue.use(Vuefire);


Vue.config.productionTip = false;

new Vue({
  firebase: {
    chores: firebase.database().ref('chores').orderByChild('created_at')
  },
  router,
  store,
  render: h => h(App),
  created () {
      firebase.auth().onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
              this.$store.dispatch('auth/autoSignIn', firebaseUser)
          }
      })
  }
}).$mount('#app');
