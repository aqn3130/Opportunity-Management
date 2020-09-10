import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { sync } from 'vuex-router-sync';
import axios from 'axios';

Vue.config.productionTip = false
sync(store,router);
const token = localStorage.getItem("token");
window.USER = null;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios
      .get(`api/get-current-user`)
      .then(function({ data }) {
        window.USER = data;
      })
      .catch(function(error) {
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
    render: h => h(App)
  }).$mount("#app");
}
