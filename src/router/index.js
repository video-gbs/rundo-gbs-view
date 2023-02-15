import Vue from 'vue'
import Router from 'vue-router'
import { Local } from '@/utils/storage'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import { getRouters } from '@/api/method/menus'

Vue.use(Router)

NProgress.configure({ showSpinner: false })

export const staticRouters = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  // {
  //   path: '/workTable',
  //   name: 'workTable',
  //   component: () => import('@/views/leftMenus/workTable/index'),
  //   meta: { title: '首页', icon: 'zhgzt' }
  // },
  // {
  //   path: '/redirect',
  //   name: 'redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/workTable',
    name: 'workTable',
    hidden: true,
    children: [
      {
        path: '/workTable',
        name: 'workTable',
        component: () => import('@/views/leftMenus/workTable/index'),
        meta: { title: '首页', icon: 'zhgzt' }
      }
    ]
  }
  // {
  //   path: '/resourceManagement',
  //   name: 'resourceManagement',
  //   component: Layout,
  //   redirect: '/equipment',
  //   meta: { title: '资源管理', icon: 'zygl' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/equipment',
  //       name: 'equipment',
  //       author: superAdmin,
  //       component: () => import('@/views/leftMenus/resourceManagement/index'),
  //       meta: { title: '前端设备', icon: '' }
  //     },
  //     {
  //       path: '/addEquipment/:type',
  //       name: 'addEquipment',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/AddEquipment.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加设备', icon: '' }
  //     },
  //     {
  //       path: '/editEquipment',
  //       name: 'editEquipment',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/EditEquipment.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '编辑设备', icon: '' }
  //     },
  //     {
  //       path: '/activeDiscovery/:type',
  //       name: 'activeDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/ActiveDiscovery.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加角色', icon: '' }
  //     },
  //     {
  //       path: '/channelDiscovery/:type',
  //       name: 'channelDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/ChannelDiscovery.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加通道', icon: '' }
  //     },
  //     {
  //       path: '/displayControlEquipment',
  //       name: 'displayControlEquipment',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/displayControlEquipment.vue'
  //         ),
  //       meta: { title: '显示控制设备', icon: '' }
  //     },
  //     {
  //       path: '/live',
  //       name: 'live',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/resourceManagement/live.vue'),
  //       meta: { title: '视频设备', icon: '' }
  //     }
  //   ]
  // },
  // {
  //   path: '/systemManagement',
  //   name: 'systemManagement',
  //   component: Layout,
  //   redirect: '/accountManagement',
  //   meta: { title: '组织管理', icon: 'zzgl' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/securityArea',
  //       name: 'securityArea',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/securityArea/index'),
  //       meta: { title: '安防区域', icon: '' }
  //     },
  //     {
  //       path: '/accountManagement',
  //       name: 'accountManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/accountManagement/index'),
  //       meta: { title: '用户管理', icon: '' }
  //     },
  //     {
  //       path: '/user/:type',
  //       name: 'user',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userAdd.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '新增用户', icon: '' }
  //     },
  //     {
  //       path: '/editUser/:type',
  //       name: 'editUser',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userEdit.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '编辑用户', icon: '' }
  //     },
  //     {
  //       path: '/roleManagement',
  //       name: 'roleManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/roleManagement/index'),
  //       meta: { title: '角色管理', icon: '' }
  //     },
  //     {
  //       path: '/unitManagement',
  //       name: 'unitManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/unitManagement/index'),
  //       meta: { title: '部门管理', icon: '' }
  //     },
  //     {
  //       path: '/creatingRole/:type',
  //       name: '/creatingRole',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '新建角色', icon: '' }
  //     },
  //     {
  //       path: '/otherUnitManagement',
  //       name: 'OtherUnitManagement',
  //       author: superAdmin,
  //       hidden: true,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/otherUnitManagement/index'
  //         ),
  //       meta: { title: '单位账号管理', icon: '' }
  //     }
  //   ]
  // },
  // {
  //   path: '/management',
  //   name: 'management',
  //   component: Layout,
  //   redirect: '/applicationManagement',
  //   meta: { title: '应用管理', icon: 'sys' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/applicationManagement',
  //       name: 'applicationManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/applicationManagement.vue'
  //         ),
  //       meta: { title: '应用管理', icon: '' }
  //     },
  //     {
  //       path: '/menuManagement',
  //       name: 'menuManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/menuManagement.vue'
  //         ),
  //       meta: { title: '菜单管理', icon: '' }
  //     },
  //     {
  //       path: '/apiManagement',
  //       name: 'apiManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/system/apiManagement.vue'),
  //       meta: { title: '接口管理', icon: '' }
  //     },
  //     {
  //       path: '/dataDictionary',
  //       name: 'dataDictionary',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/dataDictionary.vue'
  //         ),
  //       meta: { title: '数据字典', icon: '' }
  //     }
  //     // {
  //     //   path: '/creatingRole/:type',
  //     //   name: 'creatingRole',
  //     //   component: () =>
  //     //     import(
  //     //       '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
  //     //     ),
  //     //   author: superAdmin,
  //     //   hidden: true,
  //     //   meta: { title: '新建角色', icon: '' }
  //     // },
  //     // {
  //     //   path: '/otherUnitManagement',
  //     //   name: 'OtherUnitManagement',
  //     //   author: superAdmin,
  //     //   hidden: true,
  //     //   component: () =>
  //     //     import(
  //     //       '@/views/leftMenus/systemManagement/otherUnitManagement/index'
  //     //     ),
  //     //   meta: { title: '单位账号管理', icon: '' }
  //     // }
  //   ]
  // },
  // ,

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

// const pageAuthor = {}

// function setPageAuthor(v) {
//   v.forEach((i) => {
//     if (i.author !== null && i.author !== undefined) {
//       pageAuthor[i.name] = i.author
//     }
//     if (i.children) {
//       setPageAuthor(i.children)
//     }
//   })
// }
// setPageAuthor(constantRoutes)
// export { constantRoutes, pageAuthor }

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

// export default new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: staticRouters
// })

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRouters
})

// const createRouter = () =>
//   new Router({
//     mode: 'history',
//     scrollBehavior: () => ({ y: 0 }),
//     routes: staticRouters
//   })

// const router = createRouter()
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher
// }

const whiteList = ['/login']

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
})
router.beforeEach((to, from, next) => {
  // debugger
  console.log(to, '查看to')
  console.log(store.state.user.init, 'store.state.user.init')
  NProgress.start()
  const hasToken = Local.getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!store.state.user.init && store.state.user.routerLists) {
        getRouters().then((res) => {
          store.dispatch('user/dynamicRouters', res)
        })
        const dynamicRouters = store.state.user.routerLists

        console.log(dynamicRouters, '查看现有dynamicRouters')
        const childComponent = []
        dynamicRouters.forEach((item) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              let params = {}
              params = {
                path: child.path,
                meta: child.meta,
                name: child.name,
                // component: () => import(`@/views${child.component}`),
                component: (resolve) =>
                  require([`@/views/${child.component}`], resolve)
              }
              childComponent.push(params)
            })
            Router.options.routes.push({
              path: item.path,
              meta: item.meta,
              name: item.name,
              // component: () => import(`@/views${item.component}`),
              component: (resolve) =>
                require([`@/views/${item.component}`], resolve),
              children: childComponent
            })
          } else {
            router.addRoute({
              path: item.path,
              meta: item.meta,
              name: item.name,
              component: item.component
              // component: () => import(`@/views${item.component}.vue`),
              // component: (resolve) =>
              //   require([`@/views/${item.component}.vue`], resolve)
            })
          }
        })
        // console.log(router)
        // router.addRoutes(router.options.routes)

        store.dispatch('user/changeInit', true)
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

// 如果跳往登录页，则转到首页
function isLogin(to, next, callback) {
  if (to.path == '/login') {
    next('/')
  } else {
    callback()
  }
}

router.afterEach(() => {
  NProgress.done()
})

export default router
