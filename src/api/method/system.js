// 系統管理
import request from "@/api/fetch";

// 评论

export function getReview() {
  return request.get(`/politics/sys/config/review`);
}

export function setReview(params) {
  return request.put(`/politics/sys/config/review`, params);
}

// 审核逾期
export function getAuditConfig() {
  return request.get(`/politics/sys/config/auditConfig`);
}

export function setAuditConfig(params) {
  return request.put(`/politics/sys/config/auditConfig`, params);
}
// 回复逾期
export function getReplyConfig() {
  return request.get(`/politics/sys/config/replyConfig`);
}

export function setReplyConfig(params) {
  return request.put(`/politics/sys/config/replyConfig`, params);
}
// 满意度设置
export function getSatisfication() {
  return request.get(`/politics/sys/config/satisfication`);
}

export function setSatisfication(params) {
  return request.put(`/politics/sys/config/satisfication`, params);
}
