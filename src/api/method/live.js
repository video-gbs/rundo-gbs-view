// 实施监控
import request from '@/api/fetch'

import baseUrls from '@/utils/baseUrlConfig'

const expansion = baseUrls.base2

const device = baseUrls.base3

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
