// 评论管理
import request from '@/api/fetch'

export function addAppraise(params) {
  // 新增评价
  return request.put(`/politics/appraise`, params)
}

export function editAffiche(params, headers) {
  // 获取评价统计情况
  return request.get(`/politics/appraise/stat`,params, headers)
}

export function getAppraiseByOne(id) {
  // 查看单条评价
  return request.get(`/politics/appraise/${id}`)
}
