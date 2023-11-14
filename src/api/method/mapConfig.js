import request from '@/api/fetch'

const expansion = '/expansion'
// 地图

// 新增
export function addGis(params) {
  return request.post(`${expansion}/gis/save`, params)
}

// 新增
export function findOneStatusOnGis(params) {
  return request.get(`${expansion}/gis/findOneStatusOn`, params)
}

export function configGisList(params) {
  return request.get(`${expansion}/gis/configList`, params)
}

// 新增
export function findVideoAreaOneGis(params) {
  return request.get(`${expansion}/gis/findVideoAreaOne`, params)
}

// 新增
export function gisVideoAreaSaveGis(params) {
  return request.post(`${expansion}/gis/gisVideoAreaSave`, params)
}

// 新增
export function statusChangeGis(params) {
  return request.put(`${expansion}/gis/statusChange`, params)
}
