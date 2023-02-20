// 模块管理
import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const device = baseUrls.base3
const streamanege = baseUrls.base4

export function getModuleLists(data) {
  // 网关列表
  return request.get(`${device}/gateway/north/page`, data)
}

export function updateModuleLists(data) {
  // 网关编辑
  return request.put(`${device}/gateway/north/update`, data)
}

export function gatewayCorrelation(data) {
  // 网关关联
  return request.post(
    `${streamanege}/gateway-dispatch/north/gateway/binding`,
    data
  )
}

export function getNorthLists(data) {
  // 流媒体列表
  return request.get(`${streamanege}/dispatch/north/page`, data)
}

export function updateNorthLists(data) {
  // 流媒体编辑
  return request.put(`${streamanege}/dispatch/north/update`, data)
}

export function getAllNorthLists(data) {
  // 获取所有流媒体调度服务的名称
  return request.get(`${streamanege}/dispatch/north/name`, data)
}
