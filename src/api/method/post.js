// 岗位管理
import request from '@/api/fetch'

export function getPostList(params) {
  // 岗位列表
  return request.post(`/politics/sys/demos/page`, params)
}

export function addPost(params) {
  // 新增岗位
  return request.post(`/politics/sys/demos`, params)
}

export function editPost(params) {
  // 编辑岗位
  return request.put(`/politics/sys/demos`, params)
}

export function deletePost(id) {
  // 删除岗位
  return request.delete(`/politics/sys/demos/${id}`)
}
