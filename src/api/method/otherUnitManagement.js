
// 其他单位管理
import request from '@/api/fetch'

export function otherUnitAdd(params) {
    // 新增
    return request.post(`/politics/sys/dept/user/add`, params)
}

export function otherUnitEdit(params) {
    // 编辑
    return request.put(`/politics/sys/dept/user/edit`, params)
}

export function otherUnitList(params) {
    // 列表
    return request.post(`/politics/sys/dept/user/list`, params)
}

export function otherUnitEditPassword(params) {
    // 修改密码
    return request.put(`/politics/sys/dept/user/mup`, params)
}


export function otherUnitDelete(id) {
    // 删除
    return request.delete(`/politics/sys/dept/user/del/${id}`)
}


export function otherUnitRoleId(params) {
    return request.get('/politics/sys/dept/user/roleIds', params)
}

