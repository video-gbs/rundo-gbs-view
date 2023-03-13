import Vue from 'vue'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { Local } from '@/utils/storage'

const requestTimeOut = 20 * 100000
const isShowLogin = false
const noToken = ['/politics/sys/login', '/politics/v1/file/batchUploadImg']
// create an axios instance
// console.log('process.env.VUE_APP_BASE_API',process.env)
// axios.defaults.transformResponse = jb
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: requestTimeOut // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers = { ...config.headers, ...{} } // 不知为何 这里的headers是undefined,所以需要设置成{}
    const token = Local.getToken()
    // config.headers.Authorization= token;
    if (noToken.indexOf(config.url) !== -1) {
      // 图片上传不传token
      delete config.headers.Authorization
      return config
    }
    if (token) {
      config.headers.Authorization = token
      return config
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

const ls = ['MANAGE_USER_TOKEN', 'rj_token', 'rj_deptType']

const logoutFn = () => {
  ls.forEach((i) => {
    Local.remove(i)
  })
  router.push('/login')
}

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 0) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('发生错误，退出重新登录', '错误', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          logoutFn()
        })
      } else if (res.code === 50000) {
        Message({
          message: res.message || '系统连接异常',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (res.code === 401) {
        Message({
          message: res.message || '登录过期,请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        logoutFn()
      } else {
        Message({
          message: res.msg || res.message || '发生错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    let msg = '系统连接异常'
    if ((error + '').indexOf('401') > -1) {
      logoutFn()
      msg = '账户信息已过期,请重新登录。'
    }

    if ((error + '').indexOf('403') > -1) {
      msg = '您的账号无访问权限。'
    }
    if ((error + '').indexOf('405') > -1) {
      msg = '数据请求异常'
    }
    if ((error + '').indexOf('500') > -1) {
      msg = '系统连接异常'
    }
    if ((error + '').indexOf('502') > -1) {
      msg = '服务器连接超时'
    }
    console.log('err info:' + error) // for debug
    if (
      document &&
      document.getElementsByClassName('el-message').length === 0
    ) {
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
