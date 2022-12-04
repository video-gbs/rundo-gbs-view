// 邀请回复管理

import request from "@/api/fetch";
export function addAffairsassist(params) {
  // 发起邀请回复
  return request.post(`/politics/basicFlow/applyInviteReply`, params);
}
export function assistDeptList(params) {
  // 获取受邀单位列表
  return request.get(`/politics/affairsAudit/inviteAffairAudit`, params);
}
export function inviteReplyAudit(params) {
  // 审核邀请回复的申请
  return request.post(`/politics/mailboxFlow/inviteReplyAudit`, params);
}
export function getAffairsassistList(params) {
  // 获取邀请回复信息列表
  return request.post(`/politics/affairsAudit/invite/list`, params);
}

export function getAffairsassistPage(params) {
  // 获取邀请回复信息列表 -分页版
  return request.post(`/politics/affairsassist/page`, params);
}
export function getAffairsassistByOne(id) {
  // 获取单条邀请回复信息
  return request.get(`/politics/affairsassist/${id}`);
}
export function examineAffairsassist(params) {
  // 邀请回复信息审批
  return request.post(`/politics/affairsassist/examine`, params);
}

export function otherDeptReply(params) {
  // 被邀请的单位回复问政
  return request.post(`/politics/basicFlow/otherDeptReply`, params);
}
