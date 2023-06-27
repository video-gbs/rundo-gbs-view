import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import { Local } from '@/utils/storage'
import { logout } from '@/api/method/user'

const requestTimeOut = 20 * 100000

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
  updataTokenAPI: function () {
    let that = this
    axios({
      method: 'post',
      url: `http://192.192.192.92:9090/oauth2/token?grant_type=refresh_token&refresh_token=${Local.get(
        'refresh_token'
      )}`,
      headers: {
        Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      }
    })
      .then(function (res) {
        console.log('res', res)
        if (res.data.data.access_token) {
          // 防止重复调refresh_token接口
          that.isRefresh = false
          let result = res.data
          let millisecond = new Date().getTime()
          let expiresTime = result.expires_in * 1000
          let utilTime = millisecond + expiresTime
          Local.set('access_token', result.access_token, {
            expires: expiresTime
          })
          Local.set('utilTime', utilTime)
          Local.set('refresh_token', result.refresh_token)
          Local.set('expires_in', result.expires_in)
        } else {
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

        console.log(err)
        logout()
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
    console.log('config', config)
    config.data = JSON.stringify(config.data)
    init.timer = new Date().getTime()
    if (Local.get('access_token')) {
      if (
        (parseInt(Local.get('utilTime')) - init.timer) / (1000 * 60 * 60) <
        0
      ) {
        Local.remove('access_token')
        Local.remove('utilTime')
        Local.remove('expires_in')
        Local.remove('refresh_token')
        logout()
          .then((res) => {})
          .catch(() => {})
          .finally(() => {
            Local.clear()
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            })
          })
      }
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Local.get('access_token')}`
      }
    } else {
      config.headers = {
        'Content-Type': 'application/json'
      }
    }
    return config
  },
  (error) => {
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(error)
  }
)

//响应拦截器即异常处理
service.interceptors.response.use(
  (response) => {
    console.log(999, response)
    if (Local.get('utilTime')) {
      if (!init.isRefresh) {
        // 是否是到期前30分钟
        if (
          (parseInt(Local.get('utilTime')) - init.timer) / (1000 * 60 * 60) <
          0.5
        ) {
          init.isRefresh = true
          init.updataTokenAPI()
        }
      }
    }
    return response
  },
  (err) => {
    // debugger
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('错误请求')
          break
        case 401:
          //刷新token失败只能跳转到登录页重新登录
          logout()
            .then((res) => {})
            .catch(() => {})
            .finally(() => {
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
            })
          break
        case 403:
          init.openMessage('拒绝访问')
          break
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
