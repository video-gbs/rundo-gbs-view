// 模块管理
import request from '@/api/fetch'

const expansion = '/expansion'

export function getModuleLists(data) {
  // 网关列表 新版
  return request.get(`${expansion}/gateway/page`, data)
}

export function updateModuleLists(data) {
  // 网关编辑 新版
  return request.put(`${expansion}/gateway/update`, data)
}

export function gatewayCorrelation(data) {
  // 网关关联 新版
  return request.post(`${expansion}/gateway-dispatch/gateway/binding`, data)
}

export function getNorthLists(data) {
  // 流媒体列表 新版
  return request.get(`${expansion}/dispatch/page`, data)
}

export function updateNorthLists(data) {
  // 流媒体编辑 新版
  return request.put(`${expansion}/dispatch/update`, data)
}

export function getAllNorthLists(data) {
  // 获取所有流媒体调度服务的名称 新版
  return request.get(`${expansion}/dispatch/name`, data)
}

export function getAllNorthDispatchLists(data) {
  // 获取所有流媒体调度服务绑定的网关 新版
  return request.get(`${expansion}/gateway-dispatch/dispatch/data/in`, data)
}

export function getAllUnNorthDispatchLists(data) {
  // 获取所有流媒体调度服务未绑定的网关 新版
  return request.get(`${expansion}/gateway-dispatch/dispatch/data/not-in`, data)
}

export function bindingNorthLists(data) {
  // 关联流媒体调度服务的网关 新版
  return request.post(`${expansion}/gateway-dispatch/dispatch/binding`, data)
}

export function unbindingNorthLists(data) {
  // 剔除流媒体调度服务的网关
  return request.post(`${expansion}/gateway-dispatch/dispatch/unbinding`, data)
}

export function getAllGatewayLists(data) {
  // 获取所有下拉网关 新版
  return request.get(`${expansion}/gateway/name`, data)
}

export function getPlaybackList(data) {
  // 获取所有下拉网关
  return request.get(`${expansion}/channel/record`, data)
}
