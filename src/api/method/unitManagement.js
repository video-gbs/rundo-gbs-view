// 单位管理
import request from '@/api/fetch'

export function unitAdd(params) {
  // 新增
  return request.post(`/sysOrg/add`, params)
}

export function unitEdit(params) {
  // 编辑
  return request.post(`/sysOrg/update`, params)
}

export function unitList(params) {
  // 列表
  return request.post(`/sysOrg/getList`, params)
}

export function unitDelete(id) {
  // 删除
  return request.post(`/sysOrg/remove/${id}`)
}

export function getUnitDetails(id) {
  // 获取部门信息
  return request.get(`/sysOrg/getById/${id}`)
}
