// 首页管理
import request from '@/api/fetch'

const rundoAuthServer = '/auth'
const rbac = '/rbac'

export function getHomeLists(data) {
  // 权限树
  return request.get(`${rundoAuthServer}/home/index`, data)
}

export function getTypeTreeMenus(data) {
  // 获取不同类型的菜单树
  return request.post(`${rundoAuthServer}/sysMenuInfo/typeTree/${data}`)
}

// 新授权
export function getHomeUser(data) {
  // 获取用户信息
  return request.get(`${rbac}/auth/user/user`, data)
}

export function getHomeFunc(data) {
  // 获取功能数据
  return request.get(`${rbac}/auth/user/func`, data)
}

export function getHomeResource(data) {
  // 获取资源数据
  return request.post(`${rbac}/auth/user/resource`, data)
}
