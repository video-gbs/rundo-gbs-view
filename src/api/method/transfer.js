// 问政转移管理
import request from '@/api/fetch'

export function applyTransferAffair(params) {
  // 申请问政转移
  return request.post(`/politics/basicFlow/applyTransferAffair`, params)
}

export function transfer(id, params) {
  // 转移问政
  return request.post(`/politics/backstage/affairsInfo/transfer/${id}`, params)
}

export function transferCheckList(params) {
  // 问政转移审核列表
  return request.post(`/politics/affairsAudit/transfer/list`, params)
}

export function transferCheckAo(params) {
  // 执行问政转移审核
  return request.post(`/politics/mailboxFlow/transferAffairAudit`, params)
}
