import Vue from 'vue'
import App from './App.vue'
import store from './store';

Vue.config.productionTip = false

let vm = new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

console.log(vm.$store);