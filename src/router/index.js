import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import { Local } from '@/utils/storage'

Vue.use(Router)

NProgress.configure({ showSpinner: false })

export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/workTable',
    name: 'workTable',
    component: () => import('@/views/leftMenus/workTable/index'),
    meta: { title: '首页', icon: 'zhgzt' }
  }
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
  // {
  //   path: '/404',
  //   component: () => import('@/views/404.vue'),
  //   hidden: true
  // },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/workTable',
  //   name: 'workTable',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/workTable',
  //       name: 'workTable',
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

  //   children: [
  //     {
  //       path: '/equipment',
  //       name: 'equipment',

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

  //       hidden: true,
  //       meta: { title: '编辑设备', icon: '' }
  //     },
  //     {
  //       path: '/channelDiscovery/:type',
  //       name: 'channelDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/ChannelDiscovery.vue'
  //         ),

  //       hidden: true,
  //       meta: { title: '添加通道', icon: '' }
  //     },

  //     {
  //       path: '/live',
  //       name: 'live',

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

  //   children: [
  //     {
  //       path: '/securityArea',
  //       name: 'securityArea',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/securityArea/index'),
  //       meta: { title: '安防区域', icon: '' }
  //     },
  //     {
  //       path: '/accountManagement',
  //       name: 'accountManagement',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/accountManagement/index'),
  //       meta: { title: '用户管理', icon: '' }
  //     },
  //     {
  //       path: '/featureApi',
  //       name: 'featureApi',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/FeatureApi/index'),
  //       meta: { title: '功能接口', icon: '' }
  //     },
  //     {
  //       path: '/moduleManagement',
  //       name: 'moduleManagement',

  //       component: () =>
  //         import('@/views/leftMenus/resourceManagement/components/ModuleManagement.vue'),
  //       meta: { title: '模块管理', icon: '' }
  //     },
  //     {
  //       path: '/user',
  //       name: 'user',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userAdd.vue'
  //         ),

  //       hidden: true,
  //       meta: { title: '新增用户', icon: '' }
  //     },
  //     {
  //       path: '/editUser',
  //       name: 'editUser',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userEdit.vue'
  //         ),

  //       hidden: true,
  //       meta: { title: '编辑用户', icon: '' }
  //     },
  //     {
  //       path: '/roleManagement',
  //       name: 'roleManagement',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/roleManagement/index'),
  //       meta: { title: '角色管理', icon: '' }
  //     },
  //     {
  //       path: '/resourceInterface',
  //       name: 'resourceInterface',
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/resourceInterface/index'),
  //       meta: { title: '资源接口', icon: '' }
  //     },

  //     {
  //       path: '/unitManagement',
  //       name: 'unitManagement',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/unitManagement/index'),
  //       meta: { title: '部门管理', icon: '' }
  //     },
  //     {
  //       path: '/creatingRole',
  //       name: '/creatingRole',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
  //         ),
  //       meta: { title: '新建角色', icon: '' }
  //     },
  //     {
  //       path: '/otherUnitManagement',
  //       name: 'OtherUnitManagement',

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

  //   children: [
  //     {
  //       path: '/applicationManagement',
  //       name: 'applicationManagement',

  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/applicationManagement.vue'
  //         ),
  //       meta: { title: '应用管理', icon: '' }
  //     },
  //     {
  //       path: '/menuManagement',
  //       name: 'menuManagement',

  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/menuManagement.vue'
  //         ),
  //       meta: { title: '菜单管理', icon: '' }
  //     },
  //     {
  //       path: '/apiManagement',
  //       name: 'apiManagement',

  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/system/apiManagement.vue'),
  //       meta: { title: '接口管理', icon: '' }
  //     },
  //     {
  //       path: '/dataDictionary',
  //       name: 'dataDictionary',

  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/dataDictionary.vue'
  //         ),
  //       meta: { title: '数据字典', icon: '' }
  //     },
  //     {
  //       path: '/userDiscovery',
  //       name: 'userDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/UserDiscovery.vue'
  //         ),

  //       hidden: true,
  //       meta: { title: '关联角色', icon: '' }
  //     }
  //   ]
  // }
]

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRouters
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
})
// 取到浏览器出现网址的最后"/"出现的后边的字符
const getLastUrl = (str, yourStr) => str.slice(str.lastIndexOf(yourStr))

router.beforeEach(async (to, from, next) => {
  // console.log('进入路由守卫', to)
  const hasToken = Local.get('access_token')
  if (hasToken) {
    const init = store.state.user.init
    const dynamicRouters = JSON.parse(Local.get('dynamicRouters'))

    // console.log('~~~~~~~~~~~~~~~~', init, dynamicRouters)
    if (!init && dynamicRouters) {
      // console.log('刷新了页面')
      let timestamp = Local.get('expires_in')

      clearInterval(window.interval)

      window.interval = setInterval(() => {
        timestamp = timestamp - 1
        Local.set('expires_in', timestamp)
      }, 1000)
      // 刷新页面且有route记录数据，可再次追加动态路由
      store.dispatch('user/changeDynamicRouters', dynamicRouters)
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      // console.log('不在登录页跳转')
      next('/login')
    } else {
      // console.log('在登录页跳转')
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
