// 字典管理
import request from '@/api/fetch'

const auth = '/auth'
const rbac = '/rbac'

export function getManufacturerDictionaryList(data) {
  return request.post(`${auth}/sysDict/getByGroupCode/?groupCode=${data}`)
}

// 新权限模块
export function getDictLists(data) {
  // 字典列表
  return request.get(`${rbac}/dict/page`, data)
}

export function getGroupDictLists(data) {
  // 根据分组编码获取字典
  return request.get(`${rbac}/dict/group?groupCode=${data}`)
}

export function addDict(data) {
  // 增加字典
  return request.post(`${rbac}/dict/add`, data)
}

export function updateDict(data) {
  // 修改字典
  return request.put(`${rbac}/dict/update`, data)
}

export function deleteDict(id) {
  // 删除字典
  return request.delete(`${rbac}/dict/delete?dictIds=${id}`)
}
