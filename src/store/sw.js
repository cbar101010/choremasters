const state = {
    isUpdateAvailable: false,
    registration: null
};

const getters = {
    isUpdateAvailable: state => {
        console.log('get update available:' + state.isUpdateAvailable);
        return state.isUpdateAvailable;
    },
    registration: state => {
        return state.registration;
    }
};

const mutations = {
    setUpdateAvailable(state, newValue) {
        console.log("Updating update available to:" + newValue);
        state.isUpdateAvailable = newValue;
    },
    setRegistration(state, reg) {
        state.registration = reg;
    }
};

const actions = {
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};