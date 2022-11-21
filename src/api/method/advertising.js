// 广告管理
import request from '@/api/fetch'

export function getAdvertisingList(params) {
  // 获取广告列表
  return request.post(`/politics/advertising/list`, params)
}

export function addAdvertising(params) {
  // 新增广告
  return request.put(`/politics/advertising/add`, params)
}

export function editAdvertising(id, params) {
  // 修改广告
  return request.post(`/politics/advertising/edit/${id}`, params)
}

export function editAdvertisingOrder(id, orderValue) {
  // 修改广告循序
  return request.post(`/politics/Advertising/order/${id}/${orderValue}`)
}

export function deleteAdvertising(id) {
  // 删除广告
  return request.delete(`/politics/advertising/${id}`)
}
