import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import axios from '../plugins/axios'
import moment from 'moment'
import auth from './auth'
import user from "./user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    table: null,
    userData: [],
    loading: false,
    opportunityId: null
  },
  mutations: {
    setTable(state,value){
      state.table = value;
    },
    setData(state,data){
      state.userData = data;
    },
    setLoading(state,value){
      state.loading = value;
    },
    setOppId(state,id){
      state.opportunityId = id;
    },
  },
  actions: {
    async setCurrentTable({commit},table){
      await commit('setTable', table);
    },
    async getRecords({commit}, id){
      commit('setLoading', true);
      const { data } = (await axios.get(`${this.state.table}?id=${id}`));
      // const { data } = (await axios.get('/api/' + this.state.table));
      commit('setData', data);
      commit('setLoading', false);
      return data;
    },
    async updateRecord({commit},data){
      commit('setLoading', true);
      const { id } = data;
      let updated_date = new Date();
      updated_date = moment(updated_date).format('YYYY-MM-DD h:mm:ss');
      data.updated_at = updated_date;
      await axios({
        method: "post",
        url: `${this.state.table}?_method=PUT`,
        data: {
          data: data,
          id: id
        }
      });
      commit('setLoading',false);
    },
    async deleteRecord({commit},id){
      commit('setLoading', true);
      await axios({
        method: "delete",
        url: `${this.state.table}/${id}`
      });
      commit('setLoading',false);
    },
    async createRecord({commit},data){
      commit('setLoading', true);
      let created_at = new Date();
      created_at = moment(created_at).format('YYYY-MM-DD h:mm:ss');
      data.created_at = created_at;
      await axios({
        method: "post",
        url: `${this.state.table}`,
        data: {
          data: data
        }
      });
      commit('setLoading',false);
    }
  },
  modules: {
    auth,
    user
  }
})
