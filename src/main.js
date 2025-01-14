import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small' })
import '@/styles/index.scss'
import '../static/fonts/iconfont/iconfont.css'

import App from './App.vue'
import store from './store'
import router from './router'
import { Local, Session } from './utils/storage'
import { newRefreshToken } from '@/api/method/home'

import '@/icons'
import '@/utils/extends'
import 'babel-polyfill'

import API from './api'
Vue.prototype.$api = API

import * as moment from 'moment'

Vue.prototype.$moment = moment

import VideoTimeline from '@wanglin1994/video-timeline'
Vue.use(VideoTimeline)

import config from '@/config/index'
Vue.prototype.$_config = config
Vue.prototype.$photoUrl = config.photoUrlApi
Vue.prototype.$filePreview = config.filePreview

import {} from './permission'
// 退出登录
Vue.prototype.$logout = () => {
  Local.logout()
  window.location.reload()
}

Vue.use(ElementUI)

Vue.config.productionTip = false

//设置定时器，更新token
if (Local.get('expires_in_old') && Local.get('refresh_token')) {
  clearInterval(window.interval1)
  window.interval1 = setInterval(function () {
    if (Session.get('third_party_login')) {
      const resUrl = `${Local.get('refresh_token_url')}?accessToken=${Local.get(
        'access_token'
      )}`
      axios({
        method: 'get',
        url: resUrl,
        headers: {
          Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
        }
      }).then((res) => {
        if (res.data && res.data.code === 0) {
          const { accessToken, refreshToken, expiresIn } = res.data.data
          Local.set('access_token', accessToken)
          Local.set('refresh_token', refreshToken)
          Local.set('expires_in', expiresIn)
          Local.set('expires_in_old', expiresIn)
          let timestamp = expiresIn
          clearInterval(window.interval)

          window.interval = setInterval(() => {
            timestamp = timestamp - 1
            Local.set('expires_in', timestamp)
          }, 1000)
        }
      })
    } else {
      if (Local.get('access_token') && Local.get('expires_in')) {
        newRefreshToken(
          Local.get('refresh_token'),
          'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
        ).then((res) => {
          if (res.data && res.data.code === 0) {
            const { accessToken, refreshToken, expiresIn } = res.data.data
            Local.set('access_token', accessToken)
            Local.set('refresh_token', refreshToken)
            Local.set('expires_in', expiresIn)
            Local.set('expires_in_old', expiresIn)
            let timestamp = expiresIn
            clearInterval(window.interval)

            window.interval = setInterval(() => {
              timestamp = timestamp - 1
              Local.set('expires_in', timestamp)
            }, 1000)
          }
        })
      }
    }
  }, (Local.get('expires_in_old') * 1000) / 4)
}

// const debounce = (fn, delay) => {
//   let timer = null
//   return function () {
//     let context = this
//     let args = arguments
//     clearTimeout(timer)
//     timer = setTimeout(function () {
//       fn.apply(context, args)
//     }, delay)
//   }
// }

// const _ResizeObserver = window.ResizeObserver
// window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
//   constructor(callback) {
//     callback = debounce(callback, 16)
//     super(callback)
//   }
// }

new Vue({
  el: '#app',
  store,
  router,
  render: (h) => h(App)
})
