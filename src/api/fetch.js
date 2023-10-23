import request from '@/utils/request'
import NProgress from 'nprogress'
import {
  Message
} from 'element-ui'
import {
  authorizationValue
} from '@/settings'

const methods = {
  login(url, params) {
    params['grant_type'] = 'password'
    return request.post(url, params, {
      headers: {
        Auth: authorizationValue,
        GatewayToken: 'cGF0cm9sOmdhdGV3YXk6MTIzNDU2'
      },
      requestMethodName: 'login'
    })
  },
  get(url, params, headers) {
    return request({
      method: 'GET',
      url,
      params,
      headers
    })
  },
  get1(url, params) {
    return request({
      method: 'GET',
      url,
      params,
      headers: {
        Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      }
    })
  },
  post(url, data, headers) {
    return request({
      method: 'POST',
      url,
      data,
      headers
    })
  },
  post2(url, data, headers) {
    return request({
      method: 'POST',
      url,
      data,
      headers: {
        Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      }
    })
  },
  post1(url, data, headers) {
    return request({
      method: 'POST',
      url,
      data,
      headers
    })
  },
  put(url, data, headers) {
    return request({
      method: 'PUT',
      url,
      data,
      headers
    })
  },
  delete1(url, data, headers) {
    const resUrl = url + data.map((item) => 'idList=' + item).join('&')
    return request({
      method: 'DELETE',
      url: resUrl,
      headers
    })
  },
  delete2(url, data, headers) {
    const resUrl = url + data.map((item) => 'templateIds=' + item).join('&')
    return request({
      method: 'DELETE',
      url: resUrl,
      headers
    })
  },
  delete3(url, data, headers) {
    const resUrl = url + data.map((item) => 'id=' + item).join('&')
    return request({
      method: 'DELETE',
      url: resUrl,
      headers
    })
  },
  delete4(url, data, headers) {
    const resUrl = url + data.map((item) => 'ids=' + item).join('&')
    return request({
      method: 'DELETE',
      url: resUrl,
      headers
    })
  },
  delete5(url, data, headers) {
    const resUrl = url + data.map((item) => 'idList=' + item).join('&')
    return request({
      method: 'DELETE',
      url: resUrl,
      headers
    })
  },
  delete(url, params, headers) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    // return request.service.delete(`${url}${_params}`)
    return request({
      method: 'DELETE',
      url: url,
      _params,
      headers
    })
  },
  download(url, params, filename) {
    NProgress.start()
    return request({
        method: 'POST',
        url,
        params,
        headers: {
          responseType: 'blob'
        }
      })
      .then((r) => {
        const content = r.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, filename)
        }
        NProgress.done()
      })
      .catch(() => {
        NProgress.done()
        Message({
          message: '下载失败',
          type: 'error',
          duration: 5 * 1000
        })
      })
  },
  upload(url, data, params) {
    return request.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params
    })
  }
}

export default methods
