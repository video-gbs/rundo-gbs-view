// 展示信息管理
import request from "@/api/fetch";

export function getInfo(category) {
  // category 	1问政简介 2提问流程 3相关规定 4注意事项 5联系我们
  return request.get(`/politics/backstage/introduction/data/${category}`);
}
export function editInfo(params) {
  return request.post(`/politics/backstage/introduction/edit`, params);
}
