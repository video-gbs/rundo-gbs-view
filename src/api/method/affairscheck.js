// 问政审核管理

import request from '@/api/fetch'
export function acceptAffairs(params) {
  // 问政受理
  return request.post(`/politics/basicFlow/deptAccept`, params)
}
export function examineAffairs(params) {
  // 审核问政
  return request.post(`/politics/mailboxFlow/auditAffair`, params)
}
export function secondExamineAffairs(params) {
  // 审核问政并派遣单位 -市长、书记信箱
  return request.post(`/politics/mailboxFlow/mailboxAsignDept`, params)
}

export function replyAffairs(params) {
  // 问政回复
  return request.post(`/politics/basicFlow/mainDeptReply`, params)
}

export function replyExamineAffairs(params) {
  // 审核回复(书记-市长信箱)
  return request.post(`/politics/mailboxFlow/mailBoxReply`, params)
}

export function affairAudit(params) {
  // 获取 问政转移申请 的 转移目标部门
  return request.get(`/politics/affairsAudit/transAffairAudit`, params)
}
