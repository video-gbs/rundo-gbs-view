import axios from 'axios'
// import { Message } from 'element-ui'
import router from '@/router'
import { Local, Session } from '@/utils/storage'
import { message } from './resetMessage'

const requestTimeOut = 20 * 100000
window.isReresh = false

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'api/' : 'api/',
  timeout: requestTimeOut
})

const isTokenExpired = () => {
  // 验证当前token是否过期
  let resetTime = Session.get('expires_in')
  if (resetTime < 2000) {
    if (resetTime === 0) {
      Session.set('expires_in', '')
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
    Session.set('expires_in', timestamp)
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
    if (Session.get('access_token')) {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Session.get('access_token')}`
      }
    }
    if (isTokenExpired() && !config.url.includes('/oauth2/token')) {
      // 如果token快过期了
      if (!isRefreshing) {
        // 控制重复获取token
        isRefreshing = true
        let refreshToken = Session.get('refresh_token')
        axios({
          method: 'post',
          url: `http://xard-gbs-test.runjian.com:8080/api/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
          headers: {
            Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
          }
        })
          .then((res) => {
            if (res.data.code === 0) {
              isRefreshing = false
              const { accessToken, refreshToken, expiresIn } = res.data.data
              Session.set('access_token', accessToken)
              Session.set('refresh_token', refreshToken)
              Session.set('expires_in', expiresIn)

              isRefreshTokenExpired(expiresIn)
              onAccessTokenFetched(accessToken)
            } else {
              //刷新token失败只能跳转到登录页重新登录
              isRefreshing = false
              Local.clear()
              Session.remove('access_token')
              Local.remove('utilTime')
              Session.remove('expires_in')
              Session.remove('refresh_token')
              router.replace({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath }
              })
            }
          })
          .catch(function (err) {
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            })
            isRefreshing = false
          })
      }

      // 将其他接口缓存起来 -- 这个Promise函数很关键
      const retryRequest = new Promise((resolve) => {
        // 这里是将其他接口缓存起来的关键, 返回Promise并且让其状态一直为等待状态,
        // 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口,
        // 此时, Promise的状态就会变成resolve
        addSubscriber((newToken) => {
          // 表示用新的token去替换掉原来的token
          // config.headers.Authorization = `Bearer ${Local.get('access_token')}`
          config.headers.Authorization = `Bearer ${newToken}`
          // 替换掉url -- 因为baseURL会扩展请求url
          config.url = config.url.replace(config.baseURL, '')
          // 返回重新封装的config, 就会将新配置去发送请求
          resolve(config)
        })
      })
      return retryRequest
    }
    return config
  },
  (error) => {
    console.log('拦截器', Session.get('access_token'))
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
    console.log('err.response', err.response)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          init.openMessage(err.response.data.data)
          // console.log('4000000000000')
          return Promise.resolve(err)
        // break
        case 401:
          Local.clear()
          Session.remove('access_token')
          Session.remove('expires_in')
          Local.remove('utilTime')
          Session.remove('refresh_token')
          init.openMessage(err.response.data.msg)
          clearInterval(window.interval)
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          return Promise.resolve(err)
        case 403:
          init.openMessage(
            err.response.data.data
              ? err.response.data.msg + ':' + err.response.data.data
              : err.response.data.msg
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
      init.openMessage(err.response.data.data)
    }
    return Promise.resolve(err.response)
  }
)

export default service
