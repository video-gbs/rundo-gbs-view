import Vue from 'vue'
import Router from 'vue-router'
import { Local } from '@/utils/storage'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

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
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true
  },
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
  },
  {
    path: '/resourceManagement',
    name: 'resourceManagement',
    component: Layout,
    redirect: '/equipment',
    meta: { title: '资源管理', icon: 'zygl' },

    children: [
      {
        path: '/equipment',
        name: 'equipment',

        component: () => import('@/views/leftMenus/resourceManagement/index'),
        meta: { title: '前端设备', icon: '' }
      },
      {
        path: '/addEquipment/:type',
        name: 'addEquipment',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/AddEquipment.vue'
          ),

        hidden: true,
        meta: { title: '添加设备', icon: '' }
      },
      {
        path: '/editEquipment',
        name: 'editEquipment',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/EditEquipment.vue'
          ),

        hidden: true,
        meta: { title: '编辑设备', icon: '' }
      },
      {
        path: '/channelDiscovery/:type',
        name: 'channelDiscovery',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/ChannelDiscovery.vue'
          ),

        hidden: true,
        meta: { title: '添加通道', icon: '' }
      },

      {
        path: '/live',
        name: 'live',

        component: () =>
          import('@/views/leftMenus/resourceManagement/live.vue'),
        meta: { title: '视频设备', icon: '' }
      }
    ]
  },
  {
    path: '/systemManagement',
    name: 'systemManagement',
    component: Layout,
    redirect: '/accountManagement',
    meta: { title: '组织管理', icon: 'zzgl' },

    children: [
      {
        path: '/securityArea',
        name: 'securityArea',

        component: () =>
          import('@/views/leftMenus/systemManagement/securityArea/index'),
        meta: { title: '安防区域', icon: '' }
      },
      {
        path: '/accountManagement',
        name: 'accountManagement',

        component: () =>
          import('@/views/leftMenus/systemManagement/accountManagement/index'),
        meta: { title: '用户管理', icon: '' }
      },
      {
        path: '/featureApi',
        name: 'featureApi',

        component: () =>
          import('@/views/leftMenus/systemManagement/FeatureApi/index'),
        meta: { title: '功能接口', icon: '' }
      },
      // {
      //   path: '/featureApiTableAdd',
      //   name: 'featureApiTableAdd',

      //   component: () =>
      //     import('@/views/leftMenus/systemManagement/FeatureApi/components/FeatureApiTableAdd.vue'),
      //   meta: { title: '新增功能接口', icon: '' }
      // },
      // {
      //   path: '/featureApiTableUpdate',
      //   name: 'featureApiTableUpdate',

      //   component: () =>
      //     import('@/views/leftMenus/systemManagement/FeatureApi/components/FeatureApiTableUpdate.vue'),
      //   meta: { title: '编辑功能接口', icon: '' }
      // },
      {
        path: '/user/:type',
        name: 'user',
        component: () =>
          import(
            '@/views/leftMenus/systemManagement/accountManagement/components/userAdd.vue'
          ),

        hidden: true,
        meta: { title: '新增用户', icon: '' }
      },
      {
        path: '/editUser/:type',
        name: 'editUser',
        component: () =>
          import(
            '@/views/leftMenus/systemManagement/accountManagement/components/userEdit.vue'
          ),

        hidden: true,
        meta: { title: '编辑用户', icon: '' }
      },
      {
        path: '/roleManagement',
        name: 'roleManagement',

        component: () =>
          import('@/views/leftMenus/systemManagement/roleManagement/index'),
        meta: { title: '角色管理', icon: '' }
      },
      {
        path: '/resourceInterface',
        name: 'resourceInterface',
        component: () =>
          import('@/views/leftMenus/systemManagement/resourceInterface/index'),
        meta: { title: '资源接口', icon: '' }
      },

      {
        path: '/unitManagement',
        name: 'unitManagement',

        component: () =>
          import('@/views/leftMenus/systemManagement/unitManagement/index'),
        meta: { title: '部门管理', icon: '' }
      },
      {
        // path: '/creatingRole/:type',
        path: '/creatingRole',
        name: '/creatingRole',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
          ),
        meta: { title: '新建角色', icon: '' }
      },
      {
        path: '/otherUnitManagement',
        name: 'OtherUnitManagement',

        hidden: true,
        component: () =>
          import(
            '@/views/leftMenus/systemManagement/otherUnitManagement/index'
          ),
        meta: { title: '单位账号管理', icon: '' }
      }
    ]
  },
  {
    path: '/management',
    name: 'management',
    component: Layout,
    redirect: '/applicationManagement',
    meta: { title: '应用管理', icon: 'sys' },

    children: [
      {
        path: '/applicationManagement',
        name: 'applicationManagement',

        component: () =>
          import(
            '@/views/leftMenus/systemManagement/system/applicationManagement.vue'
          ),
        meta: { title: '应用管理', icon: '' }
      },
      {
        path: '/menuManagement',
        name: 'menuManagement',

        component: () =>
          import(
            '@/views/leftMenus/systemManagement/system/menuManagement.vue'
          ),
        meta: { title: '菜单管理', icon: '' }
      },
      {
        path: '/apiManagement',
        name: 'apiManagement',

        component: () =>
          import('@/views/leftMenus/systemManagement/system/apiManagement.vue'),
        meta: { title: '接口管理', icon: '' }
      },
      {
        path: '/dataDictionary',
        name: 'dataDictionary',

        component: () =>
          import(
            '@/views/leftMenus/systemManagement/system/dataDictionary.vue'
          ),
        meta: { title: '数据字典', icon: '' }
      }
      // {
      //   path: '/creatingRole/:type',
      //   name: 'creatingRole',
      //   component: () =>
      //     import(
      //       '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
      //     ),
      //
      //   hidden: true,
      //   meta: { title: '新建角色', icon: '' }
      // },
      // {
      //   path: '/otherUnitManagement',
      //   name: 'OtherUnitManagement',
      //
      //   hidden: true,
      //   component: () =>
      //     import(
      //       '@/views/leftMenus/systemManagement/otherUnitManagement/index'
      //     ),
      //   meta: { title: '单位账号管理', icon: '' }
      // }
    ]
  }
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

function recursion(accessRouteses, childComponent) {
  if (!accessRouteses.children) {
    accessRouteses.children.forEach((child) => {
      // 组装路由配置
      const childTemp = {
        name: child.name,
        path: child.path,
        meta: child.meta,
        hidden: child.hidden === 1 ? true : false,
        component: (resolve) => require([`@/views${child.component}`], resolve)
      }
      childComponent.push(childTemp)
    })
  } else {
    accessRouteses.children.forEach((item) => recursion(item, arr))
  }
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

//路由重复的问题 解决
// router.$addRoutes = (params) => {
//   console.log('params',params)
//   router.matcher = new Router({
//     // 重置路由规则
//     scrollBehavior: () => ({
//       y: 0
//     })
//   }).matcher
//   router.addRoutes(params) // 添加路由
// }

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
})
// 取到浏览器出现网址的最后"/"出现的后边的字符
const getLastUrl = (str, yourStr) => str.slice(str.lastIndexOf(yourStr))

/**
 * 格式化树形结构数据   生成 vue-router 层级路由表
 */
const routerCom = (viewPath) => {
  return () => require([`@/views/${viewPath}`])
}

const routerChildren = (children) => {
  children.forEach((v) => {
    v.component = routerCom(v.component)
    if (v.children !== undefined) {
      v.children = routerChildren(v.children)
    }
  })
  return children
}

// 如果跳往登录页，则转到首页
function isLogin(to, next, callback) {
  if (to.path === '/login') {
    next('/')
  } else {
    callback()
  }
}

router.afterEach(() => {
  NProgress.done()
})

export default router
