import request from '@/api/fetch'

export function homeLists(params) {
  return request.get('/politics/index/index',params)
}


