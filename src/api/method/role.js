// 角色管理
import request from '@/api/fetch'

const rundoAuthServer = '/auth'

// 角色管理
//列表
export function getRoleLists(data) {
  // 权限树
  return request.post(`${rundoAuthServer}/sysRoleInfo/getListByPage`, data)
}

export function deleteRoles(id) {
  // 删除角色
  return request.post(`${rundoAuthServer}/sysRoleInfo/remove/${id}`)
}

export function deleteAllRoles(data) {
  // 批量删除角色
  return request.post(`${rundoAuthServer}/sysRoleInfo/batchRemove`, data)
}

export function changeRolesStatus(data) {
  // 切换状态
  return request.post(`${rundoAuthServer}/sysRoleInfo/status/change`, data)
}

// 关联用户列表
export function getRelationSysUserInfoList(data) {
  // 切换状态
  return request.post(
    `${rundoAuthServer}/sysUserInfo/getRelationSysUserInfoList`,
    data
  )
}

export function permissionTree(id) {
  // 权限树
  return request.get(`/politics/sys/perms/listPermsStatusByRoleId?roleId=${id}`)
}

export function setDataAuth(params) {
  // 设置数据权限
  return request.post(`/politics/sys/roles/dataPerm/save`, params)
}

export function setAppAuth(params) {
  // 设置功能权限
  return request.post(`/politics/sys/roles/perm/save`, params)
}

// export function getRolesList(params) {
//   // 角色列表
//   return request.post(`/politics/sys/roles/list`, params)
// }

export function getRolesList(params) {
  // 角色列表
  return request.get(`${rundoAuthServer}/sysRoleInfo/getList`, params)
}

export function addRoles(params) {
  // 新增角色
  return request.post(`${rundoAuthServer}/sysRoleInfo/add`, params)
}

export function editRoles(params) {
  // 编辑角色
  return request.post(`${rundoAuthServer}/sysRoleInfo/update`, params)
}

// export function deleteRoles(id) {
//   // 删除角色
//   return request.delete(`${rundoAuthServer}/politics/sys/roles/del/${id}`)
// }

export function getSysOrgTree(params) {
  // 部门组织结构树
  return request.get(`${rundoAuthServer}/sysOrg/getSysOrgTreeById`, params)
}

export function getVideoAraeTree(params) {
  // 安防区域结构树
  return request.get(`${rundoAuthServer}/videoArae/tree`, params)
}

export function getDepartmentTree(params) {
  // 组织部门结构树
  return request.get(`${rundoAuthServer}/sysOrg/tree`, params)
}

// 用户新增获取角色表格
export function getUserInfoList(params) {
  return request.post(
    `${rundoAuthServer}/sysRoleInfo/getEditUserSysRoleInfoList`,
    params
  )
}

// 角色新增应用类列表
export function getAppMenuApiTree(id) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/getAppMenuApiTree/${id}`)
}

// 查看用户下信息
export function getRelationSysUserInfo(id) {
  return request.post(
    `${rundoAuthServer}/sysUserInfo/getRelationSysUserInfo/${id}`
  )
}

// 查询已关联用户列表
export function getRelationUserByRole(data) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/relationUserByRole`, data)
}

// 提交已关联用户列表
export function addRelationLists(data) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/relationUser/left`, data)
}
// 移除已关联用户列表
export function removeRelationLists(data) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/relationUser/right`, data)
}
// 角色编辑时候回显信息
export function getRoleDetail(id) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/getRoleDetail/${id}`)
}

// 角色状态切换
export function changeRoleStatus(data) {
  return request.post(`${rundoAuthServer}/sysRoleInfo/status/change`, data)
}

// 角色隐藏切换
export function changeRoleHidden(data) {
  return request.post(`${rundoAuthServer}/sysMenuInfo/hidden/change`, data)
}
