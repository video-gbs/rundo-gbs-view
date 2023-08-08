import request from '@/api/fetch'

const expansion = '/expansion'
// 通道
// 新增通道
export function addChannel(params) {
  return request.post(`${expansion}/channel/add`, params)
}

// 发现通道列表
export function getFindChannelById(params) {
  return request.get(`${expansion}/channel/findList`, params)
}

// 通道列表
export function getChannelById(params) {
  return request.post(`${expansion}/channel/list`, params)
}

// 批量删除
export function deleteChannels(params) {
  return request.post(`${expansion}/channel/batchDelete`, params)
}

// 删除
export function deleteChannel(id) {
  return request.delete(`${expansion}/channel/delete?id=${id}`)
}

// 移动
export function moveChannel(params) {
  return request.post(`${expansion}/channel/move`, params)
}

// 编辑
export function editChannel(params) {
  return request.put(`${expansion}/channel/edit`, params)
}

// 设备--通道列表
export function channelVideoAreaList(params) {
  return request.get(`${expansion}/channel/videoAreaList`, params)
}
