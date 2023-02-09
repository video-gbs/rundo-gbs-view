import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const rundoAuthServer = baseUrls.base1
const rundoAuthServer1 = baseUrls.base3

export function login(data) {
  return request.post(`${rundoAuthServer}/user/login`, data)
}

export function getInfo(params) {
  return request.get('/vue-admin-template/user/info', params)
}

// export function logout(params) {
//   return request.get('/politics/sys/logout', params)
// }

export function logout(params) {
  return request.post(`${rundoAuthServer}/user/logout`, params)
}

// 应用管理
// 获取应用列表
export function getAddApplicationList(params) {
  return request.post(`${rundoAuthServer}/sysAppInfo/getListByPage`, params)
}
// 添加应用
export function addApplication(params) {
  return request.post(`${rundoAuthServer}/sysAppInfo/add`, params)
}

// 获取应用信息
export function getAddApplicationById(params) {
  return request.get(`${rundoAuthServer}/sysAppInfo/getById`, params)
}

// 删除
export function deleteApplication(id) {
  return request.post(`${rundoAuthServer}/sysAppInfo/remove/${id}`)
}

// 编辑应用

export function editApplication(params) {
  return request.post(`${rundoAuthServer}/sysAppInfo/update`, params)
}

// 状态切换
export function changeStatus(params) {
  return request.post(`${rundoAuthServer}/sysAppInfo/status/change`, params)
}

// 字典管理
// 获取字典列表
export function getDictionaryList(params) {
  return request.post(`${rundoAuthServer}/sysDict/getListByPage`, params)
}
// 添加字典
export function addDictionary(params) {
  return request.post(`${rundoAuthServer}/sysDict/add`, params)
}

// 获取字典信息
export function getDictionaryById(id) {
  return request.get(`${rundoAuthServer}/sysDict/getById/${id}`)
}

// 删除
export function deleteDictionary(id) {
  return request.post(`${rundoAuthServer}/sysDict/remove/${id}`)
}

// 编辑字典

export function editDictionary(params) {
  return request.post(`${rundoAuthServer}/sysDict/update`, params)
}

// 用户模块
// 用户列表
export function getUserLists(params) {
  return request.post(`${rundoAuthServer}/sysUserInfo/getListByPage`, params)
}

// 删除
export function deteleUser(id) {
  return request.post(`${rundoAuthServer}/sysUserInfo/remove/${id}`)
}

// 批量删除
export function deteleAllUser(params) {
  return request.post(`${rundoAuthServer}/sysUserInfo/batchRemove`, params)
}

// 新增
export function addUser(params) {
  return request.post(`${rundoAuthServer}/sysUserInfo/add`, params)
}

// 编辑
export function editUser(params) {
  return request.post(`${rundoAuthServer}/sysUserInfo/update`, params)
}

export function getEditRolesDetail(id) {
  // 获取编辑详情
  return request.post(`${rundoAuthServer}/sysUserInfo/getById/${id}`)
}

// 用户状态切换
export function changeUserStatus(params) {
  return request.post(`${rundoAuthServer}/sysUserInfo/status/change`, params)
}
