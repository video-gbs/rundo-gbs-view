// 字典管理
import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const auth = baseUrls.base1

export function getManufacturerDictionaryList(data) {
  // 网关列表
  return request.post(`${auth}/sysDict/getByGroupCode/?groupCode=${data}`)
}
