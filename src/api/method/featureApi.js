import request from '@/api/fetch'

const rbac = '/rbac'

// 新功能接口权限

export function getFeatureList(params) {
  // 查询功能列表
  return request.get(`${rbac}/func/page`, params)
}

export function getFeatureResourceList(params) {
  // 查询功能列表
  return request.get(`${rbac}/func/resource/list`, params)
}

export function featureUpdateDisabled(params) {
  // 修改功能禁用状态
  return request.put(`${rbac}/func/update/disabled`, params)
}

export function featureResourceUpdateDisabled(params) {
  // 修改关联资源禁用状态
  return request.put(`${rbac}/func/resource/update/disabled`, params)
}

export function featureResourceUpdate(params) {
  // 修改功能关系资源信息
  return request.put(`${rbac}/func/resource/update`, params)
}

export function featureAssociate(params) {
  // 功能关联资源
  return request.post(`${rbac}/func/resource/associate`, params)
}

export function featureAdd(params) {
  // 添加功能接口
  return request.post(`${rbac}/func/add`, params)
}

export function featureUpdate(params) {
  // 修改功能接口
  return request.put(`${rbac}/func/update`, params)
}

export function featureDelete(id) {
  // 删除功能接口
  return request.delete(`${rbac}/func/delete?id=${id}`)
}

export function featureResourceDelete(id) {
  // 删除资源
  return request.delete(`${rbac}/func/resource/delete?funcResourceId=${id}`)
}
