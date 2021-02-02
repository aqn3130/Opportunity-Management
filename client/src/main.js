import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { sync } from 'vuex-router-sync';
import axios from 'axios';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueGoodTablePlugin from 'vue-good-table';
// import the styles
import 'vue-good-table/dist/vue-good-table.css';
// import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.use(VueGoodTablePlugin);
Vue.use(VueToast);
Vue.use(ElementUI);
Vue.config.productionTip = false;
sync(store, router);
const token = localStorage.getItem('token');
window.USER = null;
window.BUS = new Vue();

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios
    .get(`api/get-current-user`)
    .then(function({ data }) {
      window.USER = data.user;
      store.commit('auth/setCurrentUser', data);
      // console.log(data);
    })
    .catch(function() {
      window.USER = null;
    })
    .then(function() {
      startApp();
    });
} else {
  startApp();
}

async function startApp() {
  if (window.USER) {
    await store.dispatch('auth/getCurrentUser');
  }
  new Vue({
    router,
    store,
    vuetify,
    VueToast,
    render: h => h(App)
  }).$mount('#app');
}
