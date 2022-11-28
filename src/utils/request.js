import Vue from 'vue'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { Local } from '@/utils/storage'

const requestTimeOut = 20 * 100000
let isShowLogin = false

// create an axios instance

// axios.defaults.transformResponse = jb
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: requestTimeOut // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = { ...config.headers, ...{}}// 不知为何 这里的headers是undefined,所以需要设置成{}
    const token = Local.getToken()
    // config.headers.Authorization= token;
    if (config.url.indexOf('/politics/v1/file/batchUploadImg') !== -1) {
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
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

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
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 10000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


export default service
