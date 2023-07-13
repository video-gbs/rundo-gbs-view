import Vue from 'vue'
import { Local } from '@/utils/storage'

// 检测传入的元素key是否可以显示
function checkKey(currentTag, resMethod) {
  // 获取权限数组
  let permissionData = Local.get('permissionData')
    ? Local.get('permissionData')
    : []

  //如果传入的元素key不在权限数组里，则不可显示
  const result = permissionData.findIndex((v) => {
    return v.method === resMethod && v.path === currentTag
  })
  if (result !== -1) {
    return true
  } else {
    return false
  }
}
//自定义指令，用来控制按钮权限
export const buttonPermissions = Vue.directive('permission', {
  inserted(el, binding) {
    console.log(el)
    const currentTag = binding.value[0]
    const resMethod = binding.value[1]

    if ((currentTag, resMethod)) {
      let key = checkKey(currentTag, resMethod)

      if (!key) {
        //没有权限
        el.disabled = true
        el.classList.add('is-disabled')
      }
    } else {
      throw new Error('缺少唯一指令')
    }
  }
})

// export default permission
