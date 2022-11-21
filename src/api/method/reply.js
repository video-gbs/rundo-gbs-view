
// 回复管理
import request from '@/api/fetch'

export function getReplyList(id) {
  // 获取官方回复列表
  return request.get(`/politics/reply/list/${id}`)
}

export function addReply(params) {
  // 新增回复
  return request.put(`/politics/reply/add`, params)
}

export function getSpokesmanList(params) {
  // 活跃发言人列表
  return request.get(`/politics/reply/spokesmanList`)
}

export function deleteReply(id) {
  // 删除回复
  return request.delete(`/politics/reply/${id}`)
}
