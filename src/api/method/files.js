
// 文件管理
import request from '@/api/fetch'

export function uploadFiles(params) {
  return request.put(`/politics/file/upload${params.id || ''}`, params.file)
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
