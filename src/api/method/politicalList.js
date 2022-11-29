// 问政列表
import request from '@/api/fetch'

export function affairsInfoSearch(id) {
  // 通过主键查询单条数据
  return request.delete(`/politics/backstage/affairsInfo/${id}`)
}

export function affairsInfoList(params) {
  // 列表
  return request.post(`/politics/backstage/affairsInfo/list`, params)
}

export function affairsInfoDelete(id) {
  // 删除
  return request.delete(`/politics/backstage/affairsInfo/${id}`)
}
