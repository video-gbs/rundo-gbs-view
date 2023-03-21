// 字典管理
import request from '@/api/fetch'

const auth = '/auth'

export function getManufacturerDictionaryList(data) {
  // 网关列表
  return request.post(`${auth}/sysDict/getByGroupCode/?groupCode=${data}`)
}
