import request from '@/api/fetch'

const rundoAuthServer = '/auth'
const rbac = '/rbac'

// export function unitAdd(params) {
//   // 新增
//   return request.post(`${rundoAuthServer}/sysOrg/add`, params)
// }

// export function unitEdit(params) {
//   // 编辑
//   return request.post(`${rundoAuthServer}/sysOrg/update`, params)
// }

// export function unitList(params) {
//   // 列表
//   return request.post(`${rundoAuthServer}/sysOrg/getList`, params)
// }

// export function unitDelete(id) {
//   // 删除
//   return request.post(`${rundoAuthServer}/sysOrg/remove/${id}`)
// }

// export function getUnitDetails(id) {
//   // 获取部门信息
//   return request.get(`${rundoAuthServer}/sysOrg/getById/${id}`)
// }

// export function moveDepart(params) {
//   // 移动部门信息
//   return request.post(`${rundoAuthServer}/sysOrg/move`, params)
// }

// 新部门权限

export function getUnitList(params) {
  // 部门权限树
  return request.get(`${rbac}/section/tree`, params)
}

export function moveUnitFz(params) {
  // 部门父子级别移动
  return request.put(`${rbac}/section/move/fs`, params)
}

export function moveUnitXd(params) {
  // 部门兄弟节点移动
  return request.put(`${rbac}/section/move/bt`, params)
}

export function unitAdd(params) {
  // 添加部门
  return request.post(`${rbac}/section/add`, params)
}

export function unitUpdate(params) {
  // 修改部门
  return request.put(`${rbac}/section/update`, params)
}

export function unitDelete(id) {
  // 删除部门
  return request.delete(`${rbac}/section/delete?sectionId=${id}`)
}
