import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const expansion = baseUrls.base2
const device = baseUrls.base3
const expansionTest = baseUrls.base5
// 编码器
// 新增编码器
export function addEncoder(params) {
  return request.post(`${expansion}/device/add`, params)
}

// 获取列表
export function getEncoderById(params) {
  return request.post(`${expansion}/device/list`, params)
}

// 批量删除
export function deleteEncoders(params) {
  return request.post(`${expansion}/device/batchDelete`, params)
}

// 删除
export function deleteEncoder(id) {
  return request.delete(`${expansion}/device/delete/?id=${id}`)
}

// 移动
export function moveEncoder(params) {
  return request.put(`${expansion}/device/move`, params)
}

// 编辑编码器
export function editEncoder(params) {
  return request.put(`${expansion}/device/edit`, params)
}

// 编辑通道
export function editChannel(params) {
  return request.put(`${expansion}/channel/edit`, params)
}

// 代注册列表
export function getDeviceList(params) {
  return request.get(`${device}/device/north/page`, params)
}

// 代注册列表删除
export function deleteDevice(id) {
  return request.delete(`${device}/device/north/delete/?deviceId=${id}`)
}

// 编码器同步
export function syncChannel(id) {
  return request.get(`${expansion}//channel/channelSync/?deviceId=${id}`)
}

// 代注册列表编辑
// export function deleteDevice(id) {
//   return request.delete(`${device}/device/north/delete/?deviceId=${id}`)
// }

// 代注册列表同步
// export function syncDevice(id) {
//   return request.put(`${device}/device/north/sync`)
// }

// 代注册列表恢复
// export function syncDevice(id) {
//   return request.put(`${device}/device/north/sync`)
// }
