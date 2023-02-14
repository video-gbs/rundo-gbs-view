import Vue from 'vue'
import Router from 'vue-router'
// import Layout from '@/layout'
Vue.use(Router)

export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index')
  },
  {
    path: '/workTable',
    name: 'workTable',
    component: () => import('@/views/leftMenus/workTable/index'),
    meta: { title: '首页', icon: 'zhgzt' }
  }
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  // {
  //   path: '/',
  //   redirect: '/workTable',
  //   children: [
  //     {
  //       path: '/workTable',
  //       name: '首页',
  //       component: () => import('@/views/leftMenus/workTable/index'),
  //       meta: { title: '首页', icon: 'zhgzt' }
  //     }
  //   ]
  // },
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

// const router = new Router({
// 	mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes:staticRouters
// })

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: staticRouters
  })

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
