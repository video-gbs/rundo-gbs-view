import request from '@/api/fetch'

const newRundoAuthServer = '/oauth2'
const rbac = '/rbac'

// 新权限
// 测试新登录
export function newLogin(params) {
  return request.post(`${newRundoAuthServer}/token`, params)
}

// 获取菜单信息
export function getMenuLists(params) {
  return request.get(`${rbac}/auth/user/menu`, params)
}

// 退出
export function newLogout(params) {
  return request.delete(`${rbac}/auth/user/logout`, params)
}

// 用户模块

export function getUserList(params) {
  // 根据部门层级查询用户
  return request.get(`${rbac}/user/page`, params)
}

export function getRolePageLists(data) {
  // 分页查询角色
  return request.get(`${rbac}/user/page/role`, data)
}

export function userAdd(params) {
  // 新增用户
  return request.post(`${rbac}/user/add`, params)
}
export function userUpdate(params) {
  // 编辑用户
  return request.put(`${rbac}/user/update`, params)
}
export function userDelete(ids) {
  // 删除用户
  return request.delete(`${rbac}/user/delete?userIds=${ids}`)
}
export function userUpdateDisabled(params) {
  // 修改用户禁用状态
  return request.put(`${rbac}/user/update/disabled`, params)
}
