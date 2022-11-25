
// 单位管理
import request from '@/api/fetch'

export function unitAdd(params, headers) {
  // 新增
  return request.post(`/politics/sys/dept/add`, params, headers)
}

export function unitEdit(params, headers) {
  // 编辑
  return request.put(`/politics/sys/dept/edit`, params, headers)
}

export function unitList(params, headers) {
  // 列表
  return request.post(`/politics/sys/dept/list`, params, headers)
}


export function unitDelete(id, headers) {
  // 删除
  return request.delete(`/politics/sys/dept/del/${id}`,id, headers)
}
