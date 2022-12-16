// 问政列表
import request from "@/api/fetch";

export function affairsInfoSearch(id) {
  // 通过主键查询单条数据
  return request.get(`/politics/backstage/affairsInfo/${id}`);
}
export function affairsInfoSearchApply(id) {
  // 查看单条问政 申请转移列表以及申请邀请回复列表 进入 详细页 时候 用这个 取一条问政的详情
  return request.get(`/politics/affairsAudit/transfer/${id}`);
}
export function affairsInfoList(params) {
  // 列表
  return request.post(`/politics/backstage/affairsInfo/list`, params);
}
export function affairsInfoDelete(id) {
  // 删除
  return request.delete(`/politics/backstage/affairsInfo/${id}`);
}
