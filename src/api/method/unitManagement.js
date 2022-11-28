
// 单位管理
import request from '@/api/fetch'

export function unitAdd(params) {
  // 新增
  return request.post(`/politics/sys/dept/add`, params)
}

export function unitEdit(params) {
  // 编辑
  return request.put(`/politics/sys/dept/edit`, params)
}

export function unitList(params) {
  // 列表
  return request.post(`/politics/sys/dept/list`, params)
}


export function unitDelete(id) {
  // 删除
  return request.delete(`/politics/sys/dept/del/${id}`)
}
