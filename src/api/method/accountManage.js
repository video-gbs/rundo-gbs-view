// 账号管理
import request from '@/api/fetch'

export function accountAdd(params) {
  // 新增
  return request.post(`/politics/sys/users/add`, params)
}

export function accountEdit(params) {
  // 编辑
  return request.put(`/politics/sys/users/edit`, params)
}

export function accountEditPassword(params) {
  // 修改密码
  return request.put(`/politics/sys/users/mup`, params)
}

export function accountList(params) {
  // 列表
  return request.post(`/politics/sys/users/list`, params)
}

export function accountDelete(id) {
  // 删除
  return request.delete(`/politics/sys/users/del/${id}`)
}
