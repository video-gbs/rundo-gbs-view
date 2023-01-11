import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
Vue.use(ElementUI, { size: 'small' })
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { Local } from './utils/storage'

import '@/icons' // icon
import '@/permission' // permission control
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

// console.log(config)
import config from '@/config/index'
Vue.prototype.$_config = config
Vue.prototype.$photoUrl = config.photoUrlApi
Vue.prototype.$filePreview = config.filePreview
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

// 退出登录
Vue.prototype.$logout = () => {
  Local.logout()
  window.location.reload()
}

// set ElementUI lang to EN
Vue.use(ElementUI)

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
