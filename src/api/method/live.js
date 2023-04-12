// 实施监控
import request from '@/api/fetch'

const expansion = '/expserver/expansion'

const device = '/device-control'

const streamanege = '/stream-manage'

export function getPlayLists(data) {
  // 网关列表
  return request.post(`${expansion}/play/live`, data)
}

// 通道云台控制
export function ptzControl(data) {
  return request.put(`${device}/channel/north/ptz/control`, data)
}

// 1.2通道云台控制
export function ptzControl1(data) {
  return request.put(`${expansion}/ptz/operation`, data)
}

// 预置位执行

export function ptzPreset(data) {
  return request.put(`${expansion}/ptz/preset/delete`, data)
}

// 预置位编辑

export function ptzPresetEdit(data) {
  return request.put(`${expansion}/ptz/preset/edit`, data)
}

// 预置位删除

export function ptzPresetDelete(data) {
  return request.delete1(`${expansion}/ptz/preset/delete`, data)
}

// 预置位查询

export function ptzPresetLists(data) {
  return request.get(`${expansion}/ptz/preset/select`, data)
}

// 获取通道
export function getChannelPlayList(id) {
  return request.get(`${expansion}/channel/playList/?videoAreaId=${id}`)
}

export function getPlayBackUrlLists(data) {
  // 网关列表
  return request.post(`${expansion}/play/back`, data)
}

export function playStop(data) {
  // 关闭流
  return request.put(`${streamanege}/stream/north/play/stop`, data)
}

export function pauseRecordView(data) {
  // 录像暂停
  return request.put(`${expansion}/play/record/pause`, data)
}
export function resumeRecordView(data) {
  // 录像恢复
  return request.put(`${expansion}/play/record/resume`, data)
}
export function seekRecordView(data) {
  // 录像拖拉
  return request.put(`${expansion}/play/record/seek`, data)
}
export function speedRecordView(data) {
  // 录像倍速
  return request.put(`${expansion}/play/record/speed`, data)
}

export function getStreamInfo(data) {
  // 码流信息
  return request.get(`${expansion}/play/streamId/info`, data)
}

export function ptz3dEnlarge(data) {
  // 3d放大
  return request.put(`${expansion}/ptz/3d/zoom`, data)
}
