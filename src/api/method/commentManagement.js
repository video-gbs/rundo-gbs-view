// 评论管理-后台
import request from "@/api/fetch";

export function getReviewList(params) {
  // 获取评论列表
  return request.post(`/politics/backstage/review/list`, params);
}

export function getReviewOne(id) {
  // 根据id获取单个评论信息
  return request.get(`/politics/backstage/review/${id}`);
}
export function auditReview(params) {
  // 审核评论
  return request.post(`/politics/backstage/review/audit`, params);
}

export function reallyDeleteReview(id) {
  // 删除评论-永久删除
  return request.delete(`/politics/backstage/review/really/${id}`);
}

export function deleteReview(id) {
  // 删除评论-逻辑删除
  return request.delete(`/politics/backstage/review/${id}`);
}
export function refreshReview(id) {
  // 恢复评论
  return request.put(`/politics/backstage/review/${id}`);
}
export function setShowReview(id, isShow) {
  // 设置评论可见性
  return request.put(`/politics/backstage/review/updateIsShow/${id}/${isShow}`);
}

export function getCommentList(id) {
  // 根据问政id查询该问政所有评论
  return request.post(`/politics/backstage/review/list/${id}`);
}
