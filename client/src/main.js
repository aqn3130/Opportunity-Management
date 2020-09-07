import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import auth from "./store/auth";
import vuetify from './plugins/vuetify';
import { sync } from 'vuex-router-sync';

Vue.config.productionTip = false
sync(store,router);
if (!localStorage.getItem('token')) router.push('/login');
else auth.state.token = localStorage.getItem('token');
// if (!auth.state.token) router.push('login');
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
