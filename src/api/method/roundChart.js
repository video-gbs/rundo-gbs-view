// 轮播图管理

import request from '@/api/fetch'

export function getRoundChartList(params) {
  // 轮播图
  return request.post(`/politics/backstage/slideshow/list`, params)
}

export function getRoundChartOne(id) {
  // 单条轮播图
  return request.get(`/politics/backstage/slideshow/${id}`)
}

export function addRoundChart(params) {
  // 新增轮播图
  return request.put(`/politics/backstage/slideshow/add`, params)
}

export function editRoundChart(params) {
  // 编辑轮播图
  return request.post(`/politics/backstage/slideshow/edit`, params)
}

export function slideShowOrder(id, order) {
  // 编辑轮播图顺序
  return request.post(`/politics/backstage/slideshow/order/${id}/${order}`)
}
export function slideIsShow(id, isShow) {
  // 编辑轮播图顺序
  return request.post(
    `/politics/backstage/slideshow/updateIsShow/${id}/${isShow}`
  )
}

export function deleteRoundChart(id) {
  // 删除轮播图
  return request.delete(`/politics/backstage/slideshow/${id}`)
}
