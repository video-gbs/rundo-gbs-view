import Vue from 'vue'
import store from '@/store/index'
//自定义指令，用来控制按钮权限
Vue.directive('permission', {
  inserted(el, binding) {
    // 当前按钮传递的值( v-permission="'add'" 中的值)
    const currentTag = binding.value.action
    const effect = binding.value.effect
    // 获取到存放在 store 中的权限数据
    const currentRight = store.state.user.permission
    // 判断是否存在对应的按钮权限
    let item = currentRight.filter((item) => {
      return item === currentTag
    })
    //不具备权限则删除（隐藏）或者禁用该按钮 (el.parentNode 获取当前节点的父节点),根据在芫荽绑定的值去决定
    if (item.length === 0) {
      if (effect === 'disabled') {
        el.disabled = true
        el.classList.add('is-disabled')
      } else {
        el.parentNode.removeChild(el)
      }
    }
  }
})
