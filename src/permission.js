import router from './router'
import store from '@/store/index'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css'
import { Local } from '@/utils/storage'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login','/workTable']

// router.afterEach((to, from) => {
//   document.title = getPageTitle(to.meta.title)
// })
// router.beforeEach(async (to, from, next) => {
//   console.log('to~~~~~~~~~~~~~~~~~', to)
//   console.log('from~~~~~~~~~~~~~~~~~', from)
//   const hasToken = Local.getToken()
//   console.log(
//     'sessionStorage~~~~~~~~~~~~~~~~~',
//     sessionStorage.getItem('dynamicRouters')
//   )
//   console.log('store~~~~~~~~~~~~~~~~~', store.state.user.routerLists)
//   console.log('router！！！！！！！！！！！！', router)
//   if (
//     hasToken &&
//     store.state.user.routerLists.length !== 0 &&
//     sessionStorage.getItem('dynamicRouters')
//   ) {
//     // if(to.path === '/workTable'){

//     //   store.dispatch('user/changeInit', false)
//     // }
//     if (!store.state.user.init) {
//       const accessRouteses = store.state.user.routerLists
//       console.log('accessRouteses~~~~~~~~~~~~~~~~~', accessRouteses)
//       store.dispatch('user/dynamicRouters', accessRouteses)
//       next({ ...to, replace: true })
//     } else {
//       next()
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login`)
//     }
//   }
// })

// 如果跳往登录页，则转到首页
// function isLogin(to, next, callback) {
//   if (to.path == '/login') {
//     next('/')
//   } else {
//     callback()
//   }
// }

// router.afterEach(() => {
//   NProgress.done()
// })

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//       return roles.some(role => route.meta.roles.includes(role))
//   } else {
//       return true
//   }
// }

// function filterAsyncRouter (routerMap, roles) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

// 目前没有加入权限控制

// function filterAsyncRouter(asyncRouterMap) {
//   const accessedRouters = asyncRouterMap.filter((route) => {
//     if (route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children)
//     }
//     return true
//   })
//   return accessedRouters
// }
