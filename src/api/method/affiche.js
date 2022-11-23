
// 公告管理
import request from '@/api/fetch'

export function getAfficheList(params,headers) {
  // 获取公告列表
  return request.post(`/politics/affiche/list`, params,headers)
}

export function addAffiche(params) {
  // 新增公告
  return request.put(`/politics/affiche/add`, params)
}

export function editAffiche(id, params) {
  // 修改公告
  return request.post(`/politics/affiche/edit/${id}`, params)
}

export function editAfficheOrder(id, orderValue) {
  // 修改公告顺序
  return request.get(`/politics/affiche/order/${id}/${orderValue}`)
}

export function deleteAffiche(id) {
  // 删除公告
  return request.delete(`/politics/affiche/${id}`)
}
