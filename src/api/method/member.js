// 会员管理
import request from "@/api/fetch";

export function deleteMember(params) {
  // 批量删除会员
  return request.post("/politics/manage/member/deleteByIds", params);
}
export function getMemberList(params) {
  // 获取会员列表
  return request.post("/politics/manage/member/memberPage", params);
}
export function addMember(params) {
  // 新增会员
  return request.post("/politics/manage/member/save", params);
}

export function editMember(params) {
  // 编辑会员
  return request.post("/politics/manage/member/save", params);
}
