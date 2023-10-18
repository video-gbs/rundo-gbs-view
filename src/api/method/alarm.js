// 告警管理
import request from '@/api/fetch'

const alarm = '/alarm-manage'
const template = '/utils-template'

export function initAlarmEventLists(data) {
  // 分页获取事件
  return request.get(`${alarm}/event/page`, data)
}

// 新增
export function addAlarmEvent(params) {
  return request.post(`${alarm}/event/add`, params)
}

// 修改
export function editAlarmEvent(params) {
  return request.put(`${alarm}/event/update`, params)
}

// 删除
export function deleteAlarmEvent(id) {
  return request.delete(`${alarm}/event/delete?id=${id}`)
}

// 获取事件名称
export function getAlarmEventLists(params) {
  return request.get(`${alarm}/event/data/name`, params)
}

// 告警消息北向接口
// 分页获取告警信息
export function getNorthAlarmEventLists(params) {
  return request.get(`${alarm}/msg/north/page`, params)
}
// 删除告警信息
export function deleteNorthAlarmEvent(params) {
  return request.delete(`${alarm}/msg/north/delete`, params)
}

// 告警预案接口
// 分页查询
export function getSchemeAlarmEventLists(params) {
  return request.get(`${alarm}/scheme/page`, params)
}
// 获取告警预案详情
export function getSchemeAlarmEventDetails(params) {
  return request.get(`${alarm}/scheme/data`, params)
}
// 获取通道绑定的告警预案
export function getSchemeAlarmEventChannel(params) {
  return request.get(`${alarm}/scheme/channel`, params)
}
// 添加告警预案
export function addSchemeAlarmEvent(params) {
  return request.post(`${alarm}/scheme/add`, params)
}
// 修改预案是否禁用
export function editSchemeAlarmEventDisabled(params) {
  return request.put(`${alarm}/scheme/update/disabled`, params)
}
// 修改告警预案
export function editSchemeAlarmEvent(params) {
  return request.put(`${alarm}/scheme/update`, params)
}
// 删除告警预案
export function deleteSchemeAlarmEvent(params) {
  return request.delete(`${alarm}/scheme/delete`, params)
}
// 获取预案下的设备布撤防状态
export function getSchemeAlarmEventDeploy(params) {
  return request.get(`${alarm}/scheme/channel/deploy/page`, params)
}
// 通道布防
export function getSchemeAlarmEventDefense(params) {
  return request.put(`${alarm}/scheme/channel/defense`, params)
}

// 时间模板接口
// 分页获取时间模板
export function getTemplateAlarmEventLists(params) {
  return request.get(`${template}/template/page`, params)
}
// 检测时间是否可用
export function checkTemplateAlarmEvent(params) {
  return request.get(`${template}/template/check/time-in`, params)
}
// 添加时间模板
export function addTemplateAlarmEvent(params) {
  return request.post(`${template}/template/add`, params)
}
// 修改时间模板
export function editTemplateAlarmEvent(params) {
  return request.put(`${template}/template/update`, params)
}
// 删除时间模板
export function deleteTemplateAlarmEvent(data) {
  return request.delete2(`${template}/template/delete?`, data)
}
// 使用模板
export function useTemplateAlarmEvent(params) {
  return request.post(`${template}/template/use`, params)
}
// 解除模板使用
export function unuseTemplateAlarmEvent(params) {
  return request.put(`${template}/template/unuse`, params)
}

//告警扩展信息接口
//获取通道列表
export function getAlarmVideoAreaList(params) {
  return request.get(`${template}/alarm/videoAreaList`, params)
}
//获取预案通道
export function getAlarmSchemeChannel(params) {
  return request.get(`${template}/alarm/scheme/channel`, params)
}
//获取预案下布防的通道
export function getAlarmDeploy(params) {
  return request.get(`${template}/alarm/deploy/channel`, params)
}
//获取告警信息
export function getAlarmMsg(params) {
  return request.get(`${template}/alarm/msg/channel`, params)
}
