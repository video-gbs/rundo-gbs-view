import request from '@/api/fetch'

export function login(data) {
  return request.post('/vue-admin-template/user/login', data)
}

export function getInfo(params) {
  return request.get('/vue-admin-template/user/info', params)
}

export function logout() {
  return request.post('/vue-admin-template/user/logout')
}
