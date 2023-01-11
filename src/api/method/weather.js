import request from '@/api/fetch'

export function areaWeather(params) {
  return request.post('/politics/v1/common/weather/areaToWeather', params)
}

export function gpsToWeather() {
  return request.post('/politics/v1/common/weather/gpsToWeather')
}

export function editAfficheWork(params) {
  // 获取评价统计情况
  return request.get(`/politics/appraise/stat`, params)
}
