import axios from 'axios'
// import { Message } from 'element-ui'
import router from '@/router'
import {
  Local
} from '@/utils/storage'
import {
  message
} from './resetMessage'
import {
  newRefreshToken
} from '@/api/method/home'

const requestTimeOut = 20 * 100000
window.isReresh = false

const service = axios.create({
  baseURL: '/api/',
  timeout: requestTimeOut
})

const isTokenExpired = () => {
  // 验证当前token是否过期
  let resetTime = Local.get('expires_in')
  if (resetTime < Local.get('expires_in_old') / 4) {
    if (resetTime <= 0) {
      Local.set('expires_in', '')
      return false
    }
    return true
  }
  return false
}

const isRefreshTokenExpired = function (timestamp) {
  clearInterval(window.interval)
  window.interval = setInterval(() => {
    timestamp = timestamp - 1
    Local.set('expires_in', timestamp)
  }, 1000)
}

// 是否正在刷新的标记 -- 防止重复发出刷新token接口--节流阀
let isRefreshing = false

// 失效后同时发送请求的容器 -- 缓存接口
let subscribers = []

// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched(newToken) {
  subscribers.forEach((callback) => {
    callback(newToken)
  })
  // 清空缓存接口
  subscribers = []
}

// 添加缓存接口
function addSubscriber(callback) {
  subscribers.push(callback)
}

const init = {
  // 记录时间戳
  timer: null,
  openMessage: function (msg) {
    message({
      message: msg,
      type: 'error',
      showClose: true
    })
  }
}
//http request 拦截器
service.interceptors.request.use(
  (config) => {
    if (Local.get('access_token') && !config.url.includes('/oauth2/token')) {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Local.get('access_token')}`
      }
    } else {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg=`
      }
    }
    // 处理数组类型的查询参数
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (Array.isArray(config.params[key])) {
          config.params[key] = config.params[key].join(',');
        }
      })
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
    const code = response.data.code || 0
    if (code !== 0) {
      init.openMessage(response.data.msg)
      return Promise.resolve(response)
    }
    return response
  },
  async (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          if (!err.response.config.url.includes('/oauth2/token')) {
            init.openMessage(
              err.response.data.data ?
              err.response.data.msg + ':' + err.response.data.data :
              err.response.data.msg
            )
          } else {
            Local.clear()
            Local.remove('access_token')
            Local.remove('expires_in')
            Local.remove('utilTime')
            Local.remove('refresh_token')
            init.openMessage('token过期,请重新登录')
            clearInterval(window.interval)
            router.replace({
              path: '/login',
              // query: { redirect: router.currentRoute.fullPath }
            })
          }
          return Promise.resolve(err)
          // break
        case 401:
          Local.clear()
          Local.remove('access_token')
          Local.remove('expires_in')
          Local.remove('utilTime')
          Local.remove('refresh_token')
          init.openMessage(err.response.data.msg)
          clearInterval(window.interval)
          router.replace({
            path: '/login',
            // query: { redirect: router.currentRoute.fullPath }
          })
          return Promise.resolve(err)
        case 403:
          init.openMessage(
            err.response.data.data ?
            err.response.data.msg + ':' + err.response.data.data :
            err.response.data.msg
          )

          return Promise.resolve(err)
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
          init.openMessage(
            err.response.data.data ?
            err.response.data.msg + ':' + err.response.data.data :
            err.response.data.msg
          )
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
      init.openMessage(err.response.data.data)
    }
    return Promise.resolve(err.response)
  }
)

export default service
