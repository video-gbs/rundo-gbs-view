// 安防区域
import request from '@/api/fetch'

const rundoAuthServer = '/api/auth'

export function unitAdd(params) {
  // 新增
  return request.post(`${rundoAuthServer}/videoArae/add`, params)
}

export function unitEdit(params) {
  // 编辑
  return request.post(`${rundoAuthServer}/videoArae/update`, params)
}

export function unitList(params) {
  // 列表
  return request.post(`${rundoAuthServer}/videoArae/getList`, params)
}

export function unitDelete(id) {
  // 删除
  return request.post(`${rundoAuthServer}/videoArae/remove/${id}`)
}

export function getUnitDetails(id) {
  // 获取部门信息
  return request.get(`${rundoAuthServer}/videoArae/getById/${id}`)
}

export function moveDepart(params) {
  // 移动部门信息
  return request.post(`${rundoAuthServer}/videoArae/move`, params)
}
