import axios from '../plugins/axios';
export default {
  namespaced: true,
  state: {
    users: [],
    user_search_error: null,
    name: [],
    username: null,
    user: null,
    loading: false,
    userAdded: false,
    setRoleError: null
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setName(state, name) {
      state.username = name;
    },
    setSearchError(state, err) {
      state.user_search_error = err;
    },
    setUser(state, user) {
      state.user = user;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setUserAdded(state, value) {
      state.userAdded = value;
    },
    setRoleError(state, error) {
      state.setRoleError = error;
    }
  },
  actions: {
    async searchUser({ commit, state }) {
      commit('setLoading', true);
      await axios({
        method: 'get',
        url: `user/${state.username}`
      })
        .then(async function({ data }) {
          // console.log(data);
          await commit('setUsers', data);
          commit('setLoading', false);
        })
        .catch(function(e) {
          console.log(e);
          commit('setSearchError', e);
          commit('setLoading', false);
        });
    },
    async addUser({ commit, state }) {
      commit('setLoading', true);
      commit('setUserAdded', false);
      await axios({
        method: 'get',
        url: `add-user/${state.user}`
      })
        .then(function() {
          commit('setUsers', []);
          commit('setLoading', false);
          commit('setUserAdded', true);
        })
        .catch(function(e) {
          console.log(e);
          commit('setLoading', false);
        });
    },
    async resetSearch({ commit }) {
      commit('setLoading', true);
      commit('setName', null);
      await commit('setUsers', []);
      commit('setLoading', false);
    },
    async setRole({ commit }, data) {
      // console.log(data);
      return axios({
        method: 'post',
        url: '/set-role/',
        data: data
      })
        .then(function() {
          commit('setLoading', false);
        })
        .catch(function(e) {
          console.log(e);
          commit('setRoleError', e.message ? e.message : e);
          commit('setLoading', false);
        });
    },
    async getAllRoles({ commit }, data) {
      // console.log(data);
      return axios({
        method: 'get',
        url: '/all-roles/'
      });
    },
    async getUserRoles({ commit }, data) {
      // console.log(data);
      return axios({
        method: 'post',
        url: '/user-roles/',
        data: {
          name: data
        }
      });
    },
    async getRolePermissions({ commit }, data) {
      // console.log(data);
      return axios({
        method: 'post',
        url: '/role-permissions/',
        data: {
          name: data
        }
      });
    },
    async detachRole({ commit }, data) {
      return axios({
        method: 'post',
        url: '/detach-role/',
        data: {
          username: data.user,
          role: data.role
        }
      });
    },
    async deleteRole({ commit }, data) {
      // console.log(data);
      return axios({
        method: 'post',
        url: '/role-delete/',
        data: {
          name: data
        }
      });
    },
    async saveRole({ commit }, data) {
      await axios({
        method: 'post',
        url: '/create-role/',
        data: data
      });
    },
    async saveRoleAction({ commit }, data) {
      await axios({
        method: 'post',
        url: '/create-role-permission/',
        data: data
      });
    }
    // async getUsers({ commit, state }) {
    //     const { data } = (await axios.get(this.state.table));
    //     return data;
    // }
  }
};
