
// 轮播图管理

import request from '@/api/fetch'

export function getRoundChartList(params) {
  // 新增轮播图
  return request.post(`/politics/slideshow/list`, params)
}

export function addRoundChart(params) {
  // 新增轮播图
  return request.put(`/politics/slideshow/add`, params)
}

export function editRoundChart(params) {
  // 编辑轮播图
  return request.post(`/politics/slideshow/eidt/${params.id}`, params.params)
}

export function slideShowOrder(id, order) {
  // 编辑轮播图顺序
  return request.post(`/politics/slideshow/order/${id}/${order}`)
}

export function deleteRoundChart(id) {
  // 删除轮播图
  return request.delete(`/politics/slideshow/${id}`)
}
