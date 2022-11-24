import request from '@/api/fetch'

export function areaWeather(params,headers) {
  return request.post('/politics/v1/common/weather/areaToWeather',params,headers)
}


export function gpsToWeather() {
  return request.post('/politics/v1/common/weather/gpsToWeather')
}


