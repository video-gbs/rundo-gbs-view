import request from '@/api/fetch'

const expansion = '/expansion'
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
  return request.post(`${expansion}/device/move`, params)
}

// 编辑编码器
export function editEncoder(params) {
  return request.put(`${expansion}/device/edit`, params)
}

// 编辑通道
export function editChannel(params) {
  return request.put(`${expansion}/channel/edit`, params)
}

// 代注册列表 新版
export function getDeviceList(params) {
  return request.get(`${expansion}/device/unregister/list`, params)
}

// 代注册列表删除 新版
export function deleteDevice(id) {
  return request.delete(`${expansion}/device/delete/?deviceId=${id}`)
}

// 编码器同步
export function syncChannel(id) {
  return request.get(`${expansion}/channel/channelSync/?deviceId=${id}`)
}

// 设备--安防设备列表
export function deviceVideoAreaList(params) {
  return request.get(`${expansion}/device/videoAreaList`, params)
}

// 安防通道添加
export function videoAreaAdd(data) {
  return request.post(`${expansion}/videoArea/add`, data)
}
// 安防通道移动父子
export function videoAreaMove(data) {
  return request.put(`${expansion}/videoArea/move`, data)
}
// 安防通道排序
export function videoAreaSort(data) {
  return request.put(`${expansion}/videoArea/sort`, data)
}
// 安防通道编辑
export function videoAreaEdit(data) {
  return request.put(`${expansion}/videoArea/edit`, data)
}
// 安防通道删除
export function videoAreaDelete(id) {
  return request.put(`${expansion}/videoArea/delete?resourceId=${id}`)
}
