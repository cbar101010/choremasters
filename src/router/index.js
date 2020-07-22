import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Chores from '../views/Chores.vue';
import People from '../views/People.vue';
import Login from '../views/Login.vue';
import Today from '../views/Today.vue';
import Rewards from '../views/Rewards.vue';
import AuthGuard from './auth-guard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/today',
      name: 'home',
      component: Today,
      beforeEnter: AuthGuard
    },
    {
      path: '/chores',
      name: 'chores',
      component: Chores,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/people',
      name: 'people',
      component: People,
      beforeEnter: AuthGuard
    },
    {
      path: '/',
      name: 'about',
      component: Home
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: Rewards,
      beforeEnter: AuthGuard
    }
  ]
})
