<template>

  <v-app>

    <v-navigation-drawer
      v-if="isLoggedIn"
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      class="hidden-sm-and-down"
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click="" :to="item.route"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      color="green accent-3"
      >
      <v-toolbar-side-icon class="hidden-sm-and-down" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn class="hidden-sm-and-down" icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLoggedIn">
          <router-link to="/login">Login</router-link>
      </v-btn>
      <!--<v-btn v-if="!isLoggedIn" @click="showLogin = true">Login</v-btn>-->
      <v-btn v-if="loggedInAnonymously" @click="promoteLoginWithGoogle()">Link With Google</v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-list-tile-avatar v-if="userAvatar">
              <img :src="userAvatar">
          </v-list-tile-avatar>
          <v-list-tile-avatar v-else>
              <img src="https://firebasestorage.googleapis.com/v0/b/choremaster-6686c.appspot.com/o/avatar%2Fnoavatar.jpeg?alt=media&token=a8db8762-d3b7-4b66-8716-cc26da2db01b">
          </v-list-tile-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
          <v-list-tile @click="handler(logout(), drawer = !drawer)">
              <v-list-tile-action>
                  <v-icon>power_settings_new</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                  <v-list-tile-title>Logout
                  </v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
          <v-list-tile value="true" to="/">
              <v-list-tile-action>
                  <v-icon>info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                  <v-list-tile-title>About</v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-card flat class="hidden-md-and-up">
        <v-bottom-nav
                :active.sync="bottomNav"
                :value="true"
                fixed
            >
            <v-btn v-if="!item.desktop" color="teal" flat :value="item.title" v-for="(item, i) in items" :key="i" @click="" :to="item.route">
                <span v-text="item.mobileTitle || item.title"></span>
                <v-icon v-html="item.icon"></v-icon>
            </v-btn>
        </v-bottom-nav>
    </v-card>
      <v-dialog
              v-model="isUpdateAvailable"
              hide-overlay
              persistent
              color="blue"
              max-width="400">
          <v-card>
              <v-card-text>
                A new version of chorderly is available
              </v-card-text>
              <v-btn @click="updateApp()">Update</v-btn>
              <v-btn color="primary" dark @click="isUpdateAvailable = !isUpdateAvailable">Close</v-btn>
          </v-card>
      </v-dialog>
  </v-app>

</template>
<style>
    .v-select {
        margin: auto;
        width: 96%;
    }
    .main-add-btn {
        z-index: 1;
    }
    @media only screen and (max-width: 959px) {
        .main-add-btn {
            bottom: 60px;
        }
    }
    @media only screen and (min-width: 960px) {
        .main-add-btn {
            bottom: 10px;
        }
    }
</style>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  data () {
    return {
    updateDialog: true,
      clipped: true,
      drawer: true,
      fixed: false,
      showLogin: false,
      bottomNav: "",
      items: [
        {
          icon: 'home',
          title: 'Today',
          route: '/today'
        },
        {
          icon: 'people',
          title: 'Manage People',
          mobileTitle: 'People',
          route: '/people'
        },
        {
          icon: 'list',
          title: 'Manage Chores',
          mobileTitle: 'Chores',
          route: '/chores'
        },
        {
          icon: 'stars',
          title: 'Rewards',
          route: '/rewards'
        },
        {
          icon: 'info',
          title: 'About',
          route: '/',
          desktop: true
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Chore Master'
    }
  },
  computed: {
    ...mapState('auth', ['user', 'isLoggedIn', 'loggedInAnonymously']),
    ...mapState('sw', ['isUpdateAvailable', 'registration']),
    userAvatar: function() {
        let avatar = null;
        if(this.user && this.user.id) {
            let person = Object.values(this.$store.state.people.people).find(person => this.$store.state.auth.user.id === person.uid);

            if (person) {
                avatar = person.avatar;
            }
        }
        return avatar;
      }
  },
  methods: {
    ...mapActions('auth', ['promoteLoginWithGoogle', 'logout']),
    updateApp: function() {
        if (window.navigator && navigator.serviceWorker && this.registration) {
            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            });

            // Post message to service worker to update
            this.registration.waiting.postMessage('skipWaiting');
        }
    }
  }
}
</script>
