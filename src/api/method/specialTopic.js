// 专题管理
import request from "@/api/fetch";

export function getList(params) {
  // 获取专题列表
  return request.post(`/politics/backstage/projectInfo/list`, params);
}

export function addItem(params) {
  // 新增专题
  return request.post(`/politics/backstage/projectInfo`, params);
}

export function editItem(params) {
  // 编辑专题
  return request.put(`/politics/backstage/projectInfo`, params);
}

export function deleteItem(params) {
  // 删除专题
  return request.post(`/politics/backstage/projectInfo/deleteByIds`, params);
}

export function setItemShow(isShow, id) {
  // 设置隐藏-显示专题
  return request.get(`/politics/backstage/projectInfo/setShow/${isShow}`, id);
}

export function getOne(id) {
  // 获取一条专题信息
  return request.get(`/politics/backstage/projectInfo/${id}`);
}
