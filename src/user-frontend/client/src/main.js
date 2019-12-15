import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import BootstrapVue from 'bootstrap-vue'

import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "@fortawesome/fontawesome-free/css/all.css";


function uuidv4() {
  if (!window.crypto || !window.crypto.getRandomValues)
    return (+new Date) + "_" + ~~(1000000000 * Math.random());
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let userId = localStorage.getItem('userId');
if (userId == null) {
  userId = uuidv4();
  localStorage.setItem('userId', userId);
}
axios.defaults.headers.common['X-User-Id'] = userId;

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: ''
  },
})

new Vue({
  render: h => h(App),
}).$mount('#app')
