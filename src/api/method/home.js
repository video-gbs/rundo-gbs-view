// 首页管理
import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const rundoAuthServer = baseUrls.base1

export function getHomeLists(data) {
  // 权限树
  return request.get(`${rundoAuthServer}/home/index`, data)
}

// export function getRoleMenus(data) {
//   // 权限树
//   return request.post(`${rundoAuthServer}/home/index`, data)
// }
