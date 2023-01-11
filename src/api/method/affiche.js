// 公告管理
import request from '@/api/fetch'

export function getAfficheList(params, headers) {
  // 获取公告列表
  return request.post(`/politics/backstage/affiche/list`, params, headers)
}

export function getAfficheOne(id) {
  // 获取公告列表
  return request.get(`/politics/backstage/affiche/${id}`)
}

export function addAffiche(params) {
  // 新增公告
  return request.put(`/politics/backstage/affiche/add`, params)
}

export function editAffiche(id, params) {
  // 修改公告
  return request.post(`/politics/backstage/affiche/edit/${id}`, params)
}

export function editAfficheOrder(id, orderValue) {
  // 修改公告顺序
  return request.post(`/politics/backstage/affiche/order/${id}/${orderValue}`)
}
export function editAfficheIsShow(id, isShwo) {
  // 修改公告是否显示
  return request.post(
    `/politics/backstage/affiche/updateIsShow/${id}/${isShwo}`
  )
}

export function deleteAffiche(id) {
  // 删除公告
  return request.delete(`/politics/backstage/affiche/${id}`)
}
