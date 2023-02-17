import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small' })
import '@/styles/index.scss'
import '../static/fonts/iconfont/iconfont.css'

import App from './App'
import store from './store'
import router from './router'
import { Local } from './utils/storage'

import '@/icons'
import '@/permission'
import '@/utils/extends'
// import '@/utils/rem'
import '@/plugin'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

import API from '@/api'
Vue.prototype.$api = API

import * as moment from 'moment'

Vue.prototype.$moment = moment

// 引入字典
import _dict from '@/dict/index'

Vue.prototype.$dict = _dict

import config from '@/config/index'
Vue.prototype.$_config = config
Vue.prototype.$photoUrl = config.photoUrlApi
Vue.prototype.$filePreview = config.filePreview

// 退出登录
Vue.prototype.$logout = () => {
  Local.logout()
  window.location.reload()
}

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: (h) => h(App)
})
