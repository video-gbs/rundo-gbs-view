import request from '@/api/fetch'

export function login(data) {
  return request.postLogin('/politics/sys/login', data)
}

export function getInfo(params) {
  return request.get('/vue-admin-template/user/info', params)
}

export function logout() {
  return request.post('/politics/sys/logout')
}
