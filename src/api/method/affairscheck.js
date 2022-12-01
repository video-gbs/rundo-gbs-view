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

export function replyAffairs(params) {
  // 问政回复
  return request.post(`/politics/basicFlow/mainDeptReply`, params)
}

export function replyExamineAffairs(params) {
  // 审核回复(书记-市长信箱)
  return request.post(`/politics/affairscheck/reply_examine`, params)
}

