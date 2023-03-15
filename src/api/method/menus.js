import request from '@/api/fetch'

const auth = '/api/auth'
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
