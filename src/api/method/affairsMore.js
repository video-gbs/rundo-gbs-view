// 问政补充管理

import request from '@/api/fetch'
export function addAffairsMore(params) {
  // 新增补充说明
  return request.put(`/politics/affairsMore/add`, params)
}
export function editAffairsMore(id, params) {
  // 编辑补充说明
  return request.post(`/politics/affairsMore/edit/${id}`, params)
}

export function getAffairsMoreByOne(affairsId) {
  // 获取某问政的补充说明
  return request.get(`/politics/affairsMore/list/${affairsId}`)
}

export function deleteAffairsMore(id) {
  // 删除补充说明
  return request.delete(`/politics/affairsMore/${id}`)
}

