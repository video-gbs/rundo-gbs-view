// 问政管理
import request from '@/api/fetch'

export function addAffairs(params) {
  // 新增问政
  return request.put(`/politics/affairs/add`, params)
}
export function edAffairs(id, params) {
  // 编辑问政
  return request.post(`/politics/affairs/edit/${id}`, params)
}
export function getAffairsFile(id) {
  // 获取问政附件列表
  return request.get(`/politics/affairs/fileList/${id}`)
}

export function getAppraiseByOne(id, params) {
  // 查看信箱列表 市长 或者  书记
  return request.get(`/politics/affairs/letterList/${id}`, params)
}

export function getAffairsList(params) {
  // 查看问政列表
  return request.post(`/politics/affairs/list`, params)
}
export function getAffairsByOne(id) {
  // 查看单条问政
  return request.get(`/politics/affairs/${id}`)
}

export function deleteAffairs(id) {
  // 删除单条问政
  return request.delete(`/politics/affairs/${id}`)
}

export function getAffairsMost(params) {
  // 浏览(评论)最多列表
  return request.get(`/politics/affairs`, params)
}

export function getAffairsRank(dataType) {
  // 红黑榜
  return request.get(`/politics/affairs/byAppraise/${dataType}`)
}
