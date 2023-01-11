// 问政管理
import request from '@/api/fetch'

export function addAffairs(params) {
  // 新增问政
  return request.put(`/politics/backstage/affairs/add`, params)
}
export function editAffairs(params) {
  // 编辑问政
  return request.put(`/politics/backstage/affairsInfo`, params)
}
export function getAffairsFile(id) {
  // 获取问政附件列表
  return request.get(`/politics/backstage/affairs/fileList/${id}`)
}

export function getAppraiseByOne(id, params) {
  // 查看信箱列表 市长 或者  书记
  return request.get(`/politics/backstage/affairs/letterList/${id}`, params)
}

export function getAffairsList(params) {
  // 查看问政列表
  return request.post(`/politics/backstage/affairs/list`, params)
}
export function getAffairsByOne(id) {
  // 查看单条问政
  return request.get(`/politics/backstage/affairs/${id}`)
}

export function deleteAffairs(id) {
  // 删除单条问政
  return request.delete(`/politics/backstage/affairsInfo/${id}`)
}
export function reallyDeleteAffairs(id) {
  // 永久物理删除删除单条问政
  return request.delete(`/politics/backstage/affairsInfo/really/${id}`)
}

export function getAffairsMost(params) {
  // 浏览(评论)最多列表
  return request.get(`/politics/backstage/affairs`, params)
}

export function getAffairsRank(dataType) {
  // 红黑榜
  return request.get(`/politics/backstage/affairs/byAppraise/${dataType}`)
}

export function setAffairsShow(id, isShow) {
  // 修改问政可见性
  return request.post(
    `/politics/backstage/affairsInfo/updateIsShow/${id}/${isShow}`
  )
}
export function setAffairsReview(id, isShow) {
  // 修改问政评论区 是否开放
  return request.post(
    `/politics/backstage/affairsInfo/updateIsReview/${id}/${isShow}`
  )
}
