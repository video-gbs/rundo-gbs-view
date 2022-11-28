// 广告管理
import request from '@/api/fetch'

export function getAdvertisingList(params) {
  // 获取广告列表
  return request.post(`/politics/backstage/advertising/list`, params)
}
export function getAdvertisingOne(id) {
  // 获取广告列表
  return request.get(`/politics/backstage/advertising/${id}`)
}
export function addAdvertising(params) {
  // 新增广告
  return request.put(`/politics/backstage/advertising/add`, params)
}

export function editAdvertising(id, params) {
  // 修改广告
  return request.post(`/politics/backstage/advertising/edit/${id}`, params)
}

export function editAdvertisingOrder(id, orderValue) {
  // 修改广告循序
  return request.post(`/politics/backstage/advertising/order/${id}/${orderValue}`)
}

export function editAdvertisingShow(id, isShow) {
  // 修改广告显示
  return request.post(`/politics/backstage/advertising/updateIsShow/${id}/${isShow}`)
}

export function deleteAdvertising(id) {
  // 删除广告
  return request.delete(`/politics/backstage/advertising/${id}`)
}
