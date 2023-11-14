// 客户端管理
import request from '@/api/fetch'

// 新权限模块
export function getClientLists(data) {
  // 列表
  return request.get(`/auth-client/page`, data)
}

export function clientDelete(id) {
  // 删除
  return request.delete(`/auth-client/delete?id=${id}`)
}

export function addClient(data) {
  // 增加
  return request.post(`/auth-client/add`, data)
}

export function updateClient(data) {
  // 编辑
  return request.put(`/auth-client/update`, data)
}
