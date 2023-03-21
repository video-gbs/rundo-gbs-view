// 文件管理
import request from '@/api/fetch'

export function uploadImg(params) {
  // 图片上传 可批量
  return request.post(`/politics/v1/file/batchUploadImg`, params)
}

export function showImg(fileName) {
  return request.get(`/politics/file/showImg/${fileName}`)
}

export function downloadFile(fileName) {
  return request.post(`/politics/file/download/${fileName}`)
}

export function deleteFile(fileName) {
  return request.delete(`/politics/file/delete/${fileName}`)
}
