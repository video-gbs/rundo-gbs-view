import request from '@/api/fetch'

// export function login(data) {
//   return request.post('/politics/sys/login', data)
// }

export function login(data) {
  return request.post('/user/login', data)
}

export function getInfo(params) {
  return request.get('/vue-admin-template/user/info', params)
}

// export function logout(params) {
//   return request.get('/politics/sys/logout', params)
// }

export function logout(params) {
  return request.post('/user/logout', params)
}

// 应用管理
// 获取应用列表
export function getAddApplicationList(params) {
  return request.post('/sysAppInfo/getListByPage', params)
}
// 添加应用
export function addApplication(params) {
  return request.post('/sysAppInfo/add', params)
}

// 获取应用信息
export function getAddApplicationById(params) {
  return request.get('/sysAppInfo/getById', params)
}

// 删除
export function deleteApplication(id) {
  return request.post(`/sysAppInfo/remove/${id}`)
}

// 编辑应用

export function editApplication(params) {
  return request.post('/sysAppInfo/update', params)
}

// 状态切换
export function changeStatus(params) {
  return request.post('/sysAppInfo/status/change', params)
}

// 字典管理
// 获取字典列表
export function getDictionaryList(params) {
  return request.post('/sysDict/getListByPage', params)
}
// 添加字典
export function addDictionary(params) {
  return request.post('/sysDict/add', params)
}

// 获取字典信息
export function getDictionaryById(id) {
  return request.get(`/sysDict/getById/${id}`)
}

// 删除
export function deleteDictionary(id) {
  return request.post(`/sysDict/remove/${id}`)
}

// 编辑字典

export function editDictionary(params) {
  return request.post('/sysDict/update', params)
}

// // 状态切换
// export function changeStatus(params) {
//   return request.post('/sysAppInfo/status/change', params)
// }
