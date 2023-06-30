import request from '@/api/fetch'

const rbac = '/rbac'

// 新资源接口权限

export function getResourceList(params) {
  // 资源接口权限树
  return request.get(`${rbac}/resource/tree`, params)
}

export function moveResourceFz(params) {
  // 资源接口父子级别移动
  return request.put(`${rbac}/resource/move/fs`, params)
}

export function moveResourceXd(params) {
  // 资源接口兄弟节点移动
  return request.put(`${rbac}/resource/move/bt`, params)
}

export function resourceAdd(params) {
  // 添加资源接口
  return request.post(`${rbac}/resource/batch/add`, params)
}

export function resourceUpdate(params) {
  // 修改资源接口
  return request.put(`${rbac}/resource/update`, params)
}

export function resourceDelete(id) {
  // 删除资源接口
  return request.delete(`${rbac}/resource/delete/batch?resourceIds=${id}`)
}
