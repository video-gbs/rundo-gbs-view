
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

// 权限模板id列表
export function otherUnitRoleId(params) {
    return request.get('/politics/sys/dept/user/roleIds', params)
}

// 获取单位员工角色列表
export function otherUnitDeptRoleList(params) {
    return request.get('/politics/sys/dept/user/deptRoleList', params)
}


