import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import { Local } from '@/utils/storage'
import { newLogout } from '@/api/method/user'

const requestTimeOut = 20 * 100000
window.isReresh = false

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'api/' : 'api/',
  timeout: requestTimeOut
})

const methodObj = {
  get: 1,
  post: 2,
  put: 3,
  delete: 4
}

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
      url: `http://xard-gbs-test.runjian.com:8080/api/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
      headers: {
        Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      }
    })
      .then(function (res) {
        if (res.data.code === 0) {
          // 防止重复调refresh_token接口
          that.isRefresh = false
          let result = res.data.data
          Local.set('access_token', result.accessToken)
          Local.set('refresh_token', result.refreshToken)
          isRefreshTokenExpired(result.expiresIn)
          Local.set('expires_in', result.expiresIn)
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

    // let permissionDataUrl = Local.get("permissionDataUrl") ? Local.get("permissionDataUrl") : []
    // console.log('permissionDataUrlpermissionDataUrlpermissionDataUrl', permissionDataUrl,config)
    // if (permissionDataUrl.length > 0) {

    //   const result = permissionDataUrl.findIndex((v) => {
    //     return v.method === methodObj[config.method] && v.path === config.url
    //   })

    //   console.log('resultresultresultresultresult', result)

    //   if (result !== -1) {
    //     return config
    //   } else {
    //     return Promise.reject(new Error('没有授权此接口'))
    //   }
    // } else {
    //   return config
    // }
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
    if (code === 0) {
      let resetTime = Local.get('expires_in')
      if (Local.get('access_token')) {
        console.log('获取刷新tonken时间~~~~~~~~~~~~~', resetTime)
        //有没有token
        // isRefreshTokenExpired(resetTime)
        if (resetTime < 1200) {
          let refresh_token = Local.get('refresh_token')
          init.updataTokenAPI(refresh_token)
        }
      }
    } else {
      init.openMessage(response.data.msg)
      return Promise.resolve(response)
    }
    return response
  },
  async (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          init.openMessage(err.response.data.data)
          // console.log('4000000000000')
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
            query: { redirect: router.currentRoute.fullPath }
          })
          return
        case 403:
          init.openMessage(
            err.response.data.data
              ? err.response.data.msg + ':' + err.response.data.data
              : err.response.data.msg
          )
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
      init.openMessage(err.response.data.data)
    }
    return Promise.resolve(err.response)
  }
)

export default service
