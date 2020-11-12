import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios'
import axios from '../plugins/axios';
import moment from 'moment';
import auth from './auth';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    table: null,
    userData: [],
    loading: false,
    opportunityId: null,
    opportunity: null,
    page: 0,
    perPage: 10,
    openedTab: null,
    productsOption: [],
    searchStr: '',
    currentOpp: null,
    formData: null,
    filter: '',
    countries: [],
    stateOptions: [],
    relation: '',
    currentActivity: {},
    customers: []
  },
  mutations: {
    setTable(state, value) {
      state.table = value;
    },
    setData(state, data) {
      state.userData = data;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setOppId(state, id) {
      state.opportunityId = id;
    },
    setOpp(state, opp) {
      state.opportunity = opp;
    },
    setPage(state, page) {
      state.page = page;
    },
    setPerPage(state, perPage) {
      state.perPage = perPage;
    },
    setTab(state, tab) {
      state.openedTab = tab;
    },
    setProductsOption(state, products) {
      state.productsOption = products;
    },
    setSearchStr(state, searchStr) {
      state.searchStr = searchStr;
    },
    setCurrentOpp(state, currentOpp) {
      state.currentOpp = currentOpp;
    },
    setFormData(state, formData) {
      state.formData = formData;
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    setCountries(state, countries) {
      state.countries = countries;
    },
    setStateOptions(state, states) {
      state.stateOptions = states;
    },
    setRelation(state, relation) {
      state.relation = relation;
    },
    setCurrentActivity(state, currentActivity) {
      state.currentActivity = currentActivity;
    },
    setCustomers(state, customers) {
      state.customers = customers;
    }
  },
  actions: {
    async setCurrentTable({ commit }, table) {
      await commit('setTable', table);
    },
    async getRecords({ commit }, id) {
      commit('setLoading', true);
      if (this.state.searchStr === null) this.state.searchStr = '';
      const { data } = await axios.get(
        `${this.state.table}?id=${id}&&page=${this.state.page}&&perPage=${this.state.perPage}&&searchStr=${this.state.searchStr}&&filter=${this.state.filter}&&with=${this.state.relation}`
      );
      // const { data } = (await axios.get('/api/' + this.state.table));
      // commit('setData', data);
      commit('setLoading', false);
      return data;
    },
    async getSingleOpp({ commit }, id) {
      commit('setLoading', true);
      const { data } = await axios.get(
        `get-single-opp?opportunityId=${this.state.opportunityId}`
      );
      // console.log(data[0]);
      commit('setOpp', data[0]);
      commit('setOppId', data[0].Id);
    },
    async updateRecord({ commit }, data) {
      // console.log(data);
      commit('setLoading', true);
      const { id } = data;
      let updated_date = new Date();
      updated_date = moment(updated_date).format('YYYY-MM-DD h:mm:ss');
      data.updated_at = updated_date;
      await axios({
        method: 'post',
        url: `${this.state.table}?_method=PUT`,
        data: {
          data: data,
          id: id
        }
      });
      commit('setLoading', false);
    },
    async deleteRecord({ commit }, id) {
      commit('setLoading', true);
      await axios({
        method: 'delete',
        url: `${this.state.table}/${id}`
      });
      commit('setLoading', false);
    },
    async createRecord({ commit }, data) {
      // console.log(data)
      commit('setLoading', true);
      let CreationDate = new Date();
      CreationDate = moment(CreationDate).format('YYYY-MM-DD h:mm:ss');
      data.CreationDate = CreationDate;
      return axios({
        method: 'post',
        url: `${this.state.table}`,
        data: {
          data: data
        }
      });
      commit('setLoading', false);
    },
    async getSalesRep(ctx, email) {
      const { data } = await axios.get(`${this.state.table}?email=${email}`);
      return data;
    },
    async getProducts(ctx, id) {
      const { data } = await axios.get(`${this.state.table}?id=${id}`);
      return data;
    },
    async getCampaign(ctx, id) {
      const { data } = await axios.get(`${this.state.table}?id=${id}`);
      return data;
    },
    async getIndustry(ctx, id) {
      const { data } = await axios.get(`${this.state.table}?id=${id}`);
      return data;
    },
    async getStates(ctx, id) {
      const { data } = await axios.get(`${this.state.table}?id=${id}`);
      return data;
    },
    async getCurrentSalesRepOpts(ctx, salesRep) {
      const { data } = await axios.get(`opts-by-sales-rep?salesRep=${salesRep}`);
      return data;
    },
    async getCurrentCustomerOpts(ctx, customerName) {
      const { data } = await axios.get(`opts-by-customer-name?customerName=${customerName}`);
      return data;
    },
    async getCountryRegionTerritory(ctx, id) {
      const { data } = await axios.get(`country-region-territories?id=${id}`);
      return data;
    },
    async updateCountryRegionTerritory(ctx, payload) {
      const { data } = payload;
      return await axios.put(`country-region-territories/${data.id}`, data);
    },
    async createCountryRegionTerritory(ctx, payload) {
      const data = payload;
      return await axios.post(`country-region-territories`, data);
    },
    async deleteCountryRegionTerritory(ctx, id) {
      return await axios.delete(`country-region-territories/${id}`);
    }
  },
  modules: {
    auth,
    user
  }
});
