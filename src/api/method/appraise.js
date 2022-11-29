// 评论管理
import request from '@/api/fetch'

export function addAppraise(params) {
  // 新增评价
  return request.put(`/politics/backstage/appraise`, params)
}

export function editAffiche(params) {
  // 获取评价统计情况
  return request.get(`/politics/backstage/appraise/stat`, params)
}

export function getAppraiseByOne(id) {
  // 查看单条评价
  return request.get(`/politics/backstage/appraise/${id}`)
}
