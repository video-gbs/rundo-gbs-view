// 安防区域
import request from '@/api/fetch'

export function unitAdd(params) {
  // 新增
  return request.post(`/videoArae/add`, params)
}

export function unitEdit(params) {
  // 编辑
  return request.post(`/videoArae/update`, params)
}

export function unitList(params) {
  // 列表
  return request.post(`/videoArae/getList`, params)
}

export function unitDelete(id) {
  // 删除
  return request.post(`/videoArae/remove/${id}`)
}

export function getUnitDetails(id) {
  // 获取部门信息
  return request.get(`/videoArae/getById/${id}`)
}

export function moveDepart(params) {
  // 移动部门信息
  return request.post('/videoArae/move', params)
}
