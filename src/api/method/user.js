import request from '@/api/fetch'

export function login(data) {
  return request.post('/politics/sys/login', data)
}

export function getInfo(params) {
  return request.get('/vue-admin-template/user/info', params)
}

export function logout(params,headers) {
  return request.get('/politics/sys/logout',params,headers)
}
