import store from '../store'

export default (to, from, next) => {
    console.log(store.getters['auth/isLoggedIn']);
    if (store.getters['auth/isLoggedIn']) {
        next()
    } else {
        next('/login')
    }
}