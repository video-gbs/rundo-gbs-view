
// 账号管理
import request from '@/api/fetch'

export function accountAdd(params, headers) {
  // 新增
  return request.post(`/politics/sys/users/add`, params, headers)
}

export function accountEdit(params, headers) {
  // 编辑
  return request.put(`/politics/sys/users/edit`, params, headers)
}

export function accountEditPassword(params, headers) {
  // 修改密码
  return request.put(`/politics/sys/users/mup`, params, headers)
}

export function accountList(params, headers) {
  // 列表
  return request.post(`/politics/sys/users/list`, params, headers)
}


export function accountDelete(id, headers) {
  // 删除
  return request.delete(`/politics/sys/users/del/${id}`, headers)
}
