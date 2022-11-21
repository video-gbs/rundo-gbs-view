// 邀请回复管理

import request from '@/api/fetch'
export function addAffairsassist(params) {
  // 新增邀请
  return request.post(`/politics/affairsassist/add`, params)
}
export function examineAffairsassist(params) {
  // 邀请回复信息审批
  return request.post(`/politics/affairsassist/examine`, params)
}

export function getAffairsassistList(params) {
  // 获取邀请回复信息列表
  return request.post(`/politics/affairsassist/list`, params)
}

export function getAffairsassistPage(params) {
  // 获取邀请回复信息列表 -分页版
  return request.post(`/politics/affairsassist/page`, params)
}
export function getAffairsassistByOne(id) {
  // 获取单条邀请回复信息
  return request.get(`/politics/affairsassist/${id}`)
}
