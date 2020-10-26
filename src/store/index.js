import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logIn: false,
    token: null,
    role: null,
    name:null,
    factory:null,
    department:null,
    workshop:null,
  },
  mutations: {
    login_method: async function (state, data) {
      state.logIn = true;
      state.token = data.token;
      state.role = data.role;
      state.name = data.name;
      state.factory = data.factory;
      state.department = data.department;
      state.workshop = data.workshop;
      localforage.setItem("token", data.token).catch(msg => {
        console.log(msg);
      });
      localforage.setItem("role", data.role).catch(msg => {
        console.log(msg)
      });
      localforage.setItem("name", data.name).catch(msg => {
        console.log(msg)
      });
      localforage.setItem("factory", data.factory).catch(msg => {
        console.log(msg)
      });
      localforage.setItem("department", data.department).catch(msg => {
        console.log(msg)
      });
      localforage.setItem("workshop", data.workshop).catch(msg => {
        console.log(msg)
      });
    },
    logout_method: async function (state) {
      state.logIn = false;
      state.token = null;
      state.role = null;
      state.name = null;
      state.factory = null;
      state.department = null;
      state.workshop = null;
      localforage.removeItem('token').catch(error => {
        console.log(error)
      });
      localforage.removeItem('role').catch(error => {
        console.log(error)
      });
      localforage.removeItem('name').catch(error => {
        console.log(error)
      });
      localforage.removeItem('factory').catch(error => {
        console.log(error)
      });
      localforage.removeItem('department').catch(error => {
        console.log(error)
      });
      localforage.removeItem('workshop').catch(error => {
        console.log(error)
      });
    },
  },
  actions: {},
  modules: {}
})
