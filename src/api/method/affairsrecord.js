// 问政记录管理
import request from '@/api/fetch'
export function getAffairsrecordList(params) {
  // 问政记录列表
  return request.post(`/politics/affairsrecord/list`, params)
}
export function getAffairsrecordPage(params) {
  // 编辑补充说明
  return request.post(`/politics/affairsrecord/page`, params)
}
