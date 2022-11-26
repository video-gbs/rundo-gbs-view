// 角色管理
import request from '@/api/fetch'

export function addRoles(params) {
  // 新增角色
  return request.post('/politics/sys/roles/add', params)
}

export function editRoles(params) {
  // 编辑角色
  return request.put('/politics/sys/roles/edit', params)
}

export function deleteRoles(id) {
  // 删除角色
  return request.delete(`/politics/sys/roles/del/${id}`)
}

export function setDataAuth(params) {
  // 设置数据权限
  return request.post(`/politics/sys/roles/dataPerm/save`, params)
}

export function setAppAuth(params) {
  // 设置功能权限
  return request.post(`/politics/sys/roles/perm/save`, params)
}

export function roleList(params) {
  // 设置功能权限
  return request.post(`/politics/sys/roles/list`, params)
}
