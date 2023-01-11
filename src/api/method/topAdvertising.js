// 顶部广告管理
import request from '@/api/fetch'

export function getTopAd() {
  // 获取广告
  return request.get(`/politics/backstage/advertisingTop/data`)
}

export function editTopAd(params) {
  // 编辑广告
  return request.post(`/politics/backstage/advertisingTop/edit`, params)
}
export function setTopAdShow(id, isShow) {
  // 获取广告
  return request.get(
    `/politics/backstage/advertisingTop/setIsShow/${id}/${isShow}`
  )
}
