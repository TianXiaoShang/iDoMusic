import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import fastClick from 'fastclick'
import lazyLoad from "vue-lazyload"

fastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(lazyLoad,{
  loading: require('./assets/lazy3.png'),
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')


// new Vue({
//   el:"#app",
//   router,
//   store,
//   template: '<App/>' ,
//   components: { App }
// })
