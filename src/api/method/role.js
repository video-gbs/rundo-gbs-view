// 角色管理
import request from '@/api/fetch'

const rundoAuthServer = '/auth'
const rbac = '/rbac'

// 角色管理
//列表
export function getRoleLists1(data) {
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

// 新角色模块
export function getRoleLists(data) {
  // 分页查询角色
  return request.get(`${rbac}/role/page`, data)
}

export function userSearchRole(data) {
  // 用户页面的角色查询
  return request.get(`${rbac}/role/page/user`, data)
}
export function roleAdd(data) {
  // 添加角色
  return request.post(`${rbac}/role/add`, data)
}
export function roleDisable(data) {
  // 修改角色禁用状态
  return request.put(`${rbac}/role/update/disabled`, data)
}
export function roleUpdate(data) {
  // 修改角色
  return request.put(`${rbac}/role/update`, data)
}
export function roleDelete(ids) {
  // 删除角色
  return request.delete(`${rbac}/role/delete/batch?roleIds=${ids}`)
}
export function roleAssociate(data) {
  // 角色关联用户
  return request.post(`${rbac}/role/associate`, data)
}

// 编辑角色调用接口
export function getRoleMenuList(data) {
  // 获取角色菜单信息
  return request.get(`${rbac}/role/menu`, data)
}
export function getRoleResourceList(data) {
  // 获取角色资源信息
  return request.get(`${rbac}/role/resource`, data)
}
export function getRoleFuncMenuList(data) {
  // 获取角色某菜单下的功能信息
  return request.get(`${rbac}/role/func/menu`, data)
}
export function getRoleFuncList(data) {
  // 获取角色全部功能信息
  return request.get(`${rbac}/role/func`, data)
}
