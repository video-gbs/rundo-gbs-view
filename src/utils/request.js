import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import { Local } from '@/utils/storage'
import { newLogout } from '@/api/method/user'

const requestTimeOut = 20 * 100000
window.isReresh = false

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'api/' : '',
  timeout: requestTimeOut
})

//判空
const isEmpty = function (obj) {
  return (
    obj == null ||
    obj == 'undefined' ||
    obj == 'null' ||
    new String(obj).trim() == ''
  )
}

const isRefreshTokenExpired = function (timestamp) {
  clearInterval(window.interval)
  window.interval = setInterval(() => {
    timestamp = timestamp - 1
    Local.set('expires_in', timestamp)
  }, 1000)
}

const init = {
  // 记录时间戳
  timer: null,
  // 是否调过refresh_token函数
  isRefresh: false,
  openMessage: function (msg) {
    Message({
      message: msg,
      type: 'error',
      showClose: true
    })
  },
  updataTokenAPI: function (refreshToken) {
    let that = this
    axios({
      method: 'post',
      url: `http://192.192.192.92:9090/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
      headers: {
        Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      }
    })
      .then(function (res) {
        console.log('res', res)
        if (res.data.code === 0) {
          // 防止重复调refresh_token接口
          that.isRefresh = false
          let result = res.data.data
          console.log('result~~~~~~', result)
          Local.set('access_token', result.accessToken)
          Local.set('refresh_token', result.refreshToken)
          isRefreshTokenExpired(result.expiresIn)
          Local.set('expires_in', result.expiresIn)
        } else {
          console.log(2, 'else')
          //刷新token失败只能跳转到登录页重新登录
          Local.clear()
          Local.remove('access_token')
          Local.remove('utilTime')
          Local.remove('expires_in')
          Local.remove('refresh_token')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
        }
      })
      .catch(function (err) {
        //刷新token失败只能跳转到登录页重新登录

        console.log(3, err)
        newLogout()
          .then((res) => {})
          .catch(() => {})
          .finally(() => {
            Local.clear()
            Local.remove('access_token')
            Local.remove('utilTime')
            Local.remove('expires_in')
            Local.remove('refresh_token')
            that.openMessage('登录失效')
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            })
          })
      })
  }
}

//http request 拦截器
service.interceptors.request.use(
  (config) => {
    init.timer = new Date().getTime()
    if (Local.get('access_token')) {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Local.get('access_token')}`
      }
    }
    return config
  },
  (error) => {
    console.log('拦截器', Local.get('access_token'))
    return Promise.reject(error)
  }
)

//响应拦截器即异常处理
service.interceptors.response.use(
  (response) => {
    let resetTime = Local.get('expires_in')
    if (Local.get('access_token')) {
      //有没有token
      isRefreshTokenExpired(resetTime)
      if (resetTime < 120) {
        if (!window.isReresh) {
          window.isReresh = true
          let refresh_token = Local.get('refresh_token')
          init.updataTokenAPI(refresh_token)
        }
      } else window.isReresh = false
    }
    return response
  },
  async (err) => {
    // debugger
    console.log(err.response.status)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('错误请求')
          break
        case 401:
          Local.clear()
          Local.remove('access_token')
          Local.remove('expires_in')
          Local.remove('utilTime')
          Local.remove('refresh_token')
          init.openMessage('登录失效')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          return
        case 403:
          Local.clear()
          Local.remove('access_token')
          Local.remove('expires_in')
          Local.remove('utilTime')
          Local.remove('refresh_token')
          init.openMessage('登录失效')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          return
        case 404:
          init.openMessage('请求错误,未找到该资源')
          break
        case 405:
          init.openMessage('请求方法未允许')
          break
        case 408:
          init.openMessage('请求超时')
          break
        case 500:
          init.openMessage('服务器端出错')
          break
        case 501:
          init.openMessage('网络未实现')
          break
        case 502:
          init.openMessage('网络错误')
          break
        case 503:
          init.openMessage('服务不可用')
          break
        case 504:
          init.openMessage('网络超时')
          break
        case 505:
          init.openMessage('http版本不支持该请求')
          break
        default:
          init.openMessage(`连接错误${err.response.status}`)
      }
    } else {
      init.openMessage('连接服务器失败')
    }
    return Promise.resolve(err.response)
  }
)

export default service
