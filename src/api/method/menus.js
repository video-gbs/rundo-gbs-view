import request from '@/api/fetch'

const auth = '/auth'
const rbac = '/rbac'
// 菜单管理
// 新增菜单
export function addMenuInfo(params) {
  return request.post(`${auth}/sysMenuInfo/add`, params)
}

// 菜单列表
export function getMenuInfoLists(params) {
  return request.post(`${auth}/sysMenuInfo/tree`, params)
}

// 删除
export function deleteMenuInfo(id) {
  return request.post(`${auth}/sysMenuInfo/remove/${id}`)
}

// 编辑
export function editMenuInfo(params) {
  return request.post(`${auth}/sysMenuInfo/update`, params)
}

// 所属应用
export function getApplicationList(params) {
  return request.get(`${auth}/sysAppInfo/getList`, params)
}

// 上级菜单
export function getApplicationTree(params) {
  return request.post(`${auth}/sysMenuInfo/tree`, params)
}

// 角色状态切换
export function changeMenusStatus(data) {
  return request.post(`${auth}/sysMenuInfo/status/change`, data)
}

// 角色隐藏切换
export function changeMenusHidden(data) {
  return request.post(`${auth}/sysMenuInfo/hidden/change`, data)
}

// 新权限
// 菜单列表
export function getMenuTree(data) {
  return request.get(`${rbac}/menu/tree`, data)
}

// 添加菜单
export function menuAdd(data) {
  return request.post(`${rbac}/menu/add`, data)
}

// 编辑菜单
export function menuUpdate(data) {
  return request.put(`${rbac}/menu/update`, data)
}

// 删除菜单
export function menuDelete(id) {
  return request.delete(`${rbac}/menu/delete?id=${id}`)
}

// 禁用菜单
export function menuDisabled(data) {
  return request.put(`${rbac}//menu/update/disabled`, data)
}

// 隐藏菜单
export function menuHidden(data) {
  return request.put(`${rbac}//menu/update/hidden`, data)
}
