// 首页管理
import request from '@/api/fetch'

const rundoAuthServer = '/auth'

export function getHomeLists(data) {
  // 权限树
  return request.get(`${rundoAuthServer}/home/index`, data)
}

export function getTypeTreeMenus(data) {
  // 获取不同类型的菜单树
  return request.post(`${rundoAuthServer}/sysMenuInfo/typeTree/${data}`)
}
