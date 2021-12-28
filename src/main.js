import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '../src/assets/css/global.less'
import '../src/assets/font/iconfont.css'
import SocketService from './utils/web_socket_service'
// 对服务端进行websocket的连接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/'
Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
