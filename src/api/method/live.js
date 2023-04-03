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
