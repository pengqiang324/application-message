import Vue from 'vue'
import App from './App.vue'
// import PostMessage, { postMessage } from '~/index'
import PostMessage from '~/index'
Vue.config.productionTip = false

Vue.use(PostMessage, 'http://192.168.1.90:8080')
// postMessage({ type: 'mask' })
new Vue({
  render: h => h(App),
}).$mount('#app')
