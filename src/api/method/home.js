import request from '@/api/fetch'

export function homeLists(params,headers) {
  return request.get('/politics/index/index',params,headers)
}


