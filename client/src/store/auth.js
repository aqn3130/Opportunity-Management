import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';
import Auth from '@/helpers/auth';
Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    username: null,
    password: null,
    token: null,
    loginError: null,
    currentUser: null
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setPassword(state, password) {
      state.password = password;
    },
    setToken(state, token) {
      state.token = token;
    },
    setError(state, error) {
      state.loginError = error;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  actions: {
    async login({ commit, state }) {
      const { data } = await axios({
        method: 'post',
        url: `auth/login`,
        data: {
          username: state.username,
          password: state.password
        }
      });
      commit('setToken', data.token);
      localStorage.setItem('token', data.token);
      commit('setCurrentUser', data.user);
      commit('setPassword', null);
      commit('setUsername', null);
      commit('setError', null);
      window.USER = data.user;
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      commit('setToken', null);
      commit('setCurrentUser', null);
      window.USER = null;
    },
    async getCurrentUser({ commit }) {
      const data = await axios({
        method: 'get',
        url: `get-current-user`
      })
        .then(function({ data }) {
          commit('setCurrentUser', data);
          Vue.prototype.$auth = new Auth(data.permissions, data.roles);
        })
        .catch(function(e) {
          console.log(e);
        });
    }
  }
};
