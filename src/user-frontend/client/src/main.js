import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "@fortawesome/fontawesome-free/css/all.css";


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
