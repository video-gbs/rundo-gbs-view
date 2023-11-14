import request from '@/api/fetch'

const rbac = '/rbac'

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
